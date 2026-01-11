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

class ChatBotController extends Controller
{
    const STATE_IDLE = 'idle';
    const STATE_AWAIT_CONFIRM = 'await_confirm';

    public function chat(Request $request)
    {
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
                    'message' => 'Dạ vâng ạ 😊. Vậy bạn cần tư vấn thêm về sản phẩm nào khác không ạ?'
                ]);
            }

            Session::put('chatbot_context', [
                'state' => self::STATE_IDLE,
            ]);
        }

        if (preg_match('/^(không|ko|thôi|thế thôi|đủ rồi|bye|tạm biệt|không cần)( ạ| nhé| đâu)?$/ui', $msgLower)) {
            return response()->json([
                'intro' => 'Dạ vâng, cảm ơn bạn đã ghé thăm shop! 🥰',
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
            4. OUTPUT JSON FORMAT:
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
            2. Output JSON:
            {
                \"intro\": \"Lời giới thiệu sản phẩm...\",
                \"description\": \"Viết mô tả sản phẩm...(ngắn gọn,đầy đủ,dễ hiểu)\",
                \"cta\": \"Bạn có muốn thêm {$product->name} vào giỏ hàng ngay không ạ?\"
            }
        ";
        return $this->callGemini($prompt);
    }

    private function callGemini($prompt)
    {
        try {
            $apiKey = config('services.gemini.key');

            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->retry(3, 1000)->post($url, [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [['text' => $prompt]]
                    ]
                ]
            ]);
            if ($response->failed()) {
                Log::error('Gemini API Error: ' . $response->body());
                return [];
            }

            $text = $response['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            $text = preg_replace('/^```json\s*|```$/m', '', $text);

            return json_decode($text, true) ?? [];

        } catch (\Exception $e) {
            Log::error("Gemini Exception: " . $e->getMessage());
            return [];
        }
    }

    private function callAIToSuggest(string $message)
    {
        $context = Session::get('chatbot_context', []);
        $previousIntent = $context['intent'] ?? null;
        $previousProducts = $context['products'] ?? [];
        $lastMessage = $context['last_message'] ?? null;

        $contextText = '';

        if($previousIntent) {
            $contextText .= "Ngữ cảnh trước đó:\n";
            $contextText .= "-Mục tiêu khách hàng: $previousIntent\n";
        }

        if(!empty($previousProducts)) {
            $productNamesText = implode(', ',$previousProducts);
            $contextText .= "- Sản phẩm đã gợi ý trước đó: $productNamesText\n";
        }

        if($lastMessage) {
            $contextText .= "- Câu hỏi trước đó của khách: $lastMessage\n";
        }

        $productText = Cache::remember(
            'chatbot_product_list',
            now()->addMinute(30),
            function(){
                return Product::select('name', 'price')
                ->get()
                ->map(fn($p)=> "-{$p->name}: {$p->price}đ")
                ->implode("\n");
            }
        );

        $systemPrompt = "Bạn là chatbot tư vấn bán trái cây cho website bán hàng của tôi.

        $contextText

        Danh sách trái cây đang bán:
        $productText

        Nguyên tắc:
        -Chỉ tư vấn sản phẩm có trong danh sách
        -Giải thích ngắn gọn, dễ hiểu
        -Tư vấn thân thiện, ngắn gọn
        -Ưu tiên bán hàng
        -Gợi ý sản phẩm phù hợp
        -Kết thúc bằng câu hỏi chốt đơn

        YÊU CẦU OUTPUT (BẮT BUỘC):
        - Trả về JSON hợp lệ
        - KHÔNG trả text thường
        - Format như sau:

        {
        \"intro\": \"...\",
        \"products\": [
            {
            \"name\": \"Cam sành\",
            \"description\": \"...\",
            \"price\": 45000
            }
        ],
        \"cta\": \"Bạn muốn mình tư vấn kỹ hơn về loại nào trong số trên ạ?\"
        }

        Khách hỏi: $message
        ";

        $response = Http::post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . config('services.gemini.key'),
        [
            'contents' => [
                [
                    "role" => 'user',
                    "parts" => [
                        ['text' => $systemPrompt]
                    ]
                ]
            ]
        ]);

        $text = $response['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

        $data =$this->extractJson($text);

        if (!$data || empty($data['products'])) {
            return response()->json([
                'message' => 'Mình chưa tìm được sản phẩm phù hợp ạ.'
            ]);
        }

        $productNames = collect($data['products'] ?? [])
                        ->pluck('name')
                        ->toArray();
        $intent = $this->detectIntent($message);
        Session::put('chatbot_context', [
            'intent' => $intent,
            'products' => $productNames,
            'last_message' => $message,
        ]);
        Session::save();

        return $data;
    }


    private function handleAddToCart(string $productName)
    {
        if(!Auth::check()) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để thêm vào giỏ hàng ạ.'
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

    protected function extractJson(string $text): ?array
    {
        $text = preg_replace('/```json|```/', '', $text);
        $text = trim($text, "\" \n\r\t");
        $text = trim($text);

        $data = json_decode($text, true);

        return json_last_error() === JSON_ERROR_NONE ? $data : null;

    }
}
