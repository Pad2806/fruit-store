<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class ChatBotController extends Controller
{
    const STATE_IDLE = 'idle';
    const STATE_AWAIT_CONFIRM = 'await_confirm';

    public function chat(Request $request)
    {
        // Authenticate user from token if provided (optional authentication)
        $this->authenticateFromToken($request);

        $data = $request->validate([
            'message' => 'required|string'
        ]);

        $userMessage = trim($data['message']);

        if(empty($userMessage)){
            return response()->json([
                'message' => 'Tôi chưa hiểu ý của bạn. Vui lòng giải thích rõ hơn!'
            ]);
        }

        $context = Session::get('chatbot_context', []);
        $history = $context['history'] ?? [];

        $state = $context['state'] ?? self::STATE_IDLE;
        $msgLower = mb_strtolower($userMessage);

        if($state === self::STATE_AWAIT_CONFIRM) {
            $selectedProduct = $context['selected_product'] ?? null;


            if(preg_match('/\b(có|ok|yes|đồng ý|mua|ừ|chốt)\b/u', $msgLower)){
                return $this->handleAddToCart($selectedProduct);
            }

            if(preg_match('/\b(không|no|không muốn|thôi|không cần|để sau)\b/u', $msgLower)){
                Session::put('chatbot_context', [
                    'state' => self::STATE_IDLE,
                ]);
                return response()->json([
                    'message' => 'Dạ vâng ạ. Vậy bạn cần tư vấn thêm về sản phẩm nào khác không ạ?'
                ]);
            }

            Session::put('chatbot_context', [
                'state' => self::STATE_IDLE,
            ]);
        }

        if (preg_match('/^(không|ko|thôi|thế thôi|đủ rồi|bye|tạm biệt|không cần)( ạ| nhé| đâu)?$/ui', $msgLower)) {
            return response()->json([
                'intro' => 'Dạ vâng, cảm ơn bạn đã ghé thăm shop!',
                'products' => [],
                'cta' => 'Khi nào thèm trái cây tươi ngon thì nhắn mình nhé!'
            ]);
        }

        $product = $this->findSpecialProduct($userMessage);
        if($product) {
            $aiData = $this->describeProduct($product);
            Session::put('chatbot_context', [
                'state' => self::STATE_AWAIT_CONFIRM,
                'selected_product' => $product->name,
            ]);
            // dd(Session::get('selected_product'));

            return response()->json([
                'intro' => $aiData['intro'] ?? "Sản phẩm {$product->name} có giá {$product->price}đ.",
                'products' => [$product],
                'cta' => $aiData['cta'] ?? "Bạn có muốn thêm vào giỏ hàng không?"
            ]);
        }

        $aiData = $this->suggestGeneralList($userMessage, $history);

        Session::put('chatbot_context', [
            'state' => self::STATE_IDLE,
            'history' => [
                'user' => $userMessage,
                'bot' => $aiData['intro'] ?? '',
            ],
        ]);

        return response()->json([
                'intro' => $aiData['intro'] ?? 'Dưới đây là một số sản phẩm phù hợp ạ:',
                'products' => $aiData['products'] ?? [],
                'cta' => $aiData['cta'] ?? 'Bạn muốn xem kỹ món nào?'
            ]);

    }

    private function findSpecialProduct(string $message)
    {
        $products = Product::all();
        $msg = mb_strtolower($message);
        foreach ($products as $product) {
            if (str_contains($msg, mb_strtolower($product->name))) {
                return $product;
            }
        }
        return null;
    }

    public function suggestGeneralList(string $userMessage, array $history = [])
    {
        $allProducts =Cache::remember('product_list', now()->addMinute(30), function(){
            return Product::all()
            ->map(fn($p) => "- {$p->name} ({$p->price}đ)")->implode("\n");
        });

        $historyText = "";

        if(!empty($history)) {
            $historyText = "LỊCH SỬ CHAT TRƯỚC ĐÓ (Để hiểu ngữ cảnh 'nó', 'cái đó'):\n";
            $historyText .= "- Khách: \"{$history['user']}\"\n";
            $historyText .= "- Bot: \"{$history['bot']}\"\n";
        }

        $prompt = "
            Bạn là chatbot tư vấn bán trái cây cho website bán hàng của tôi.
            Danh sách sản phẩm:
            $allProducts

            $historyText

            Khách hỏi: \"$userMessage\"

            YÊU CẦU NGHIÊM NGẶT (Tránh lan man):
            1. Phần 'intro': Tối đa 20 từ. Trả lời đúng trọng tâm câu hỏi.
            2. Nếu khách hỏi giá -> Trả lời giá. Khách hỏi ngon không -> Trả lời vị. Không chào hỏi rườm rà.
            3. Nếu lịch sử chat không liên quan đến câu hỏi hiện tại -> Bỏ qua lịch sử.
            4. Format lại đơn vị giá của sản phẩm.
            5. OUTPUT JSON FORMAT:
            {
                \"intro\": \"...\",
                \"products\": [ ... ],
                \"cta\": \"...\"
            }
        ";
        return $this->callGemini($prompt);
    }

    private function describeProduct(Product $product)
    {
        $prompt = "
            Khách đang xem sản phẩm: {$product->name}. Giá: {$product->price}.
            Mô tả trong DB: {$product->detail_desc}.

            Yêu cầu:
            1. Viết 1 đoạn giới thiệu ngắn hấp dẫn về sản phẩm này (công dụng, hương vị).
            2. Format lại đơn vị giá sản phẩm.
            2. Output JSON:
            {
                \"intro\": \"Lời giới thiệu sản phẩm...\",
                \"description\": \"Viết mô tả sản phẩm...(ngắn gọn,đầy đủ,dễ hiểu)\",
                \"cta\": \"Bạn có muốn thêm {$product->name} vào giỏ hàng ngay không ạ?\"
            }
        ";
        return $this->callGemini($prompt);
    }

    // private function callGemini($prompt)
    // {
    //     try {
    //         $apiKey = config('services.gemini.key');

    //         $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;
    //         $response = Http::withHeaders([
    //             'Content-Type' => 'application/json'
    //         ])->retry(3, 1000)->post($url, [
    //             'contents' => [
    //                 [
    //                     'role' => 'user',
    //                     'parts' => [['text' => $prompt]]
    //                 ]
    //             ]
    //         ]);
    //         if ($response->failed()) {
    //             Log::error('Gemini API Error: ' . $response->body());
    //             return [];
    //         }

    //         $text = $response['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
    //         $text = preg_replace('/^```json\s*|```$/m', '', $text);

    //         return json_decode($text, true) ?? [];

    //     } catch (\Exception $e) {
    //         Log::error("Gemini Exception: " . $e->getMessage());
    //         return [];
    //     }
    // }
    private function callGemini(string $prompt): array
{
    try {
        $apiKey = config('services.gemini.key');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type'  => 'application/json',
            'HTTP-Referer'  => config('app.url'),
            'X-Title'       => 'Laravel App',
        ])
        ->retry(3, 1000)
        ->post('https://openrouter.ai/api/v1/chat/completions', [
            'model' => 'allenai/molmo-2-8b:free',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Bạn là AI trả lời JSON thuần, không markdown.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.2,
            'max_tokens'  => 1024,
        ]);

        if ($response->failed()) {
            Log::error('Molmo API Error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return [];
        }

        $text = $response['choices'][0]['message']['content'] ?? '';

        // Remove ```json ``` nếu model lỡ trả markdown
        $text = preg_replace('/^```json\s*|```$/m', '', trim($text));

        return json_decode($text, true) ?? [];

    } catch (\Throwable $e) {
        Log::error('Molmo Exception: ' . $e->getMessage());
        return [];
    }
}

    private function handleAddToCart(string $productName)
    {
        if(!Auth::check()) {
            return response()->json([
                'intro' => "Vui lòng đăng nhập để thêm {$productName} vào giỏ hàng.",
                'products' => [],
                'cta' => "Bạn muốn đăng nhập hoặc tiếp tục xem sản phẩm khác?",
            ], 401);

        }

        $product = Product::where('name', $productName)->first();

        if(!$product) {
            Session::forget('chatbot_context');
            return response()->json([
                'message' => 'Sản phẩm không còn tồn tại ạ.'
            ], 404);
        }
        $cart = Cart::where('user_id', Auth::id())->first();
        if(!$cart) {
            $cart = Cart::create([
                'user_id' => Auth::id(),
                'id' => (string) Str::uuid(),
            ]);
        }
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if($cartItem){
            Session::forget('chatbot_context');
            return response()->json([
                'intro' => "Sản phẩm {$product->name} đã có sẵn trong giỏ hàng rồi ạ! (Số lượng hiện tại: {$cartItem->quantity})",
                'products' => [],
                'cta' => 'Bạn có muốn tìm thêm sản phẩm nào khác không?'
            ]);
        }

        $cartItem = CartItem::create([
                'id' => (string) Str::uuid(),
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_price' => $product->price,
                'quantity' => 1,
                'unit' => $product->unit,
        ]);


        Session::forget('chatbot_context');

        return response()->json([
            'message' => "Đã thêm {$product->name} vào giỏ hàng! Bạn có muốn thêm sản phẩm nào nữa không ạ?",

        ]);

    }

    public function reset()
    {
        Session::forget('chatbot_context');
        return response()->json([
            'message' => 'Chat đã được reset'
        ]);
    }

    protected function authenticateFromToken(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken && $accessToken->tokenable) {
                $expiration = config('sanctum.expiration');
                $isValid = !$expiration || $accessToken->created_at->gt(now()->subMinutes($expiration));

                if ($isValid) {
                    $user = $accessToken->tokenable->withAccessToken($accessToken);
                    Auth::setUser($user);
                }
            }
        }
    }

    protected function extractJson(string $text): ?array
    {
        $text = preg_replace('/```json|```/', '', $text);
        $text = trim($text, "\" \n\r\t");
        $text = trim($text);

        $data = json_decode($text, true);

        return json_last_error() === JSON_ERROR_NONE ? $data : null;

    }
}
