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
    public function chat(Request $request)
    {
        $data = $request->validate([
            'message' => 'required|string'
        ]);

        $userMessage = trim($data['message']);

        if ($userMessage === '') {
            return response()->json([
                'message' => 'Bạn có thể hỏi mình về sản phẩm nhé'
            ]);
        }

        $history = Session::get('chatbot_history');

        $product = $this->findProductByName($userMessage);
        if ($product && $this->wantDescribeProduct($userMessage)) {
            $aiData = $this->describeProduct($product);

            Session::put('chatbot_history', [
                'user' => $userMessage,
                'bot'  => $aiData['intro'] ?? '',
            ]);

            return response()->json([
                'intro'    => $aiData['intro'] ?? '',
                'products' => [$product],
                'cta'      => $aiData['cta'] ?? 'Bạn muốn hỏi thêm về sản phẩm nào không?'
            ]);
        }

        $aiData = $this->suggestGeneralList($userMessage, $history);

        Session::put('chatbot_history', [
            'user' => $userMessage,
            'bot'  => $aiData['intro'] ?? '',
        ]);

        return response()->json([
            'intro'    => $aiData['intro'] ?? 'Mình gợi ý cho bạn một số sản phẩm nhé:',
            'products' => $aiData['products'] ?? [],
            'cta'      => $aiData['cta'] ?? 'Bạn muốn tìm hiểu kỹ sản phẩm nào?'
        ]);
    }
    private function wantDescribeProduct(string $message): bool
{
    $message = mb_strtolower($message);

    $keywords = [
        'mô tả',
        'giải thích',
        'là gì',
        'thông tin',
        'đặc điểm',
        'công dụng',
        'ăn có tốt',
        'tác dụng',
        'vị thế nào',
        'ngon không'
    ];

    foreach ($keywords as $kw) {
        if (str_contains($message, $kw)) {
            return true;
        }
    }

    return false;
}

    private function findProductByName(string $message): ?Product
    {
        $msg = mb_strtolower($message);

        return Product::all()->first(function ($product) use ($msg) {
            return str_contains($msg, mb_strtolower($product->name));
        });
    }

    private function suggestGeneralList(string $userMessage, $history = null): array
    {
        $productList = Cache::remember('product_list_chatbot', now()->addMinutes(30), function () {
            return Product::all()
                ->map(fn ($p) => "- {$p->name} ({$p->price}đ)")
                ->implode("\n");
        });

        $historyText = '';
        if ($history) {
            $historyText = "
                LỊCH SỬ:
                - Khách: {$history['user']}
                - Bot: {$history['bot']}
                ";
        }

        $prompt = "
            Bạn là chatbot tư vấn về trái cây cho người dùng phổ thông.
            Danh sách sản phẩm hiện có:
            $productList

            $historyText

            Khách hỏi: \"$userMessage\"

            NGUYÊN TẮC BẮT BUỘC:
            1. Nếu câu hỏi liên quan đến SỨC KHỎE (dị ứng, nổi mề đay, đau bụng, tiểu đường, bà bầu, trẻ em):
                - Trả lời theo kiến thức dinh dưỡng phổ thông
                - KHÔNG chào bán
                - KHÔNG nói mua hàng
                - KHÔNG ép giới thiệu sản phẩm
            2. Nếu câu hỏi KHÔNG liên quan sức khỏe → tư vấn trái cây bình thường
            3. Trả lời ngắn gọn, dễ hiểu, đúng trọng tâm
            YÊU CẦU BẮT BUỘC VỀ GIÁ:
                - Giá phải được format theo chuẩn Việt Nam: xxx.xxxđ
                - Ví dụ:
                + 12000 → 12.000đ
                + 150000 → 150.000đ
                - TUYỆT ĐỐI KHÔNG dùng dạng 12000đ hoặc 12k

                Nếu không format đúng, coi như câu trả lời sai.
            - Output JSON:
            {
            \"intro\": \"...\",
            \"products\": [],
            \"cta\": \"...\"
            }
            ";

        return $this->callAI($prompt);
    }

    private function describeProduct(Product $product): array
    {
        $prompt = "
            YÊU CẦU BẮT BUỘC VỀ GIÁ:
                - Giá phải được format theo chuẩn Việt Nam: xxx.xxxđ
                - Ví dụ:
                + 12000 → 12.000đ
                + 150000 → 150.000đ
                - TUYỆT ĐỐI KHÔNG dùng dạng 12000đ hoặc 12k
            Nếu không format đúng, coi như câu trả lời sai.

            Khách đang hỏi về sản phẩm: {$product->name}
            Giá: {$product->price}
            Mô tả DB: {$product->detail_desc}

            Yêu cầu:
            - Giải thích dễ hiểu
            - Nêu hương vị / công dụng
            - Không kêu gọi mua
            - Nếu có giá cả thì format giá cả vnd
            - Output JSON:
            {
            \"intro\": \"...\",
            \"cta\": \"...\"
            }
            ";

        return $this->callAI($prompt);
    }

    private function callAI(string $prompt): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.gemini.key'),
                'Content-Type'  => 'application/json',
            ])
            ->retry(3, 1000)
            ->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'allenai/molmo-2-8b:free',
                'messages' => [
                    ['role' => 'system', 'content' => 'Chỉ trả JSON thuần'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
                'max_tokens' => 800,
            ]);

            if ($response->failed()) {
                Log::error('AI Error', ['body' => $response->body()]);
                return [];
            }

            $text = $response['choices'][0]['message']['content'] ?? '';
            $text = preg_replace('/```json|```/', '', $text);

            // dd($text);

            return json_decode(trim($text), true) ?? [];

        } catch (\Throwable $e) {
            Log::error('AI Exception: ' . $e->getMessage());
            return [];
        }
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
    public function reset()
    {
        Session::forget('chatbot_history');
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
