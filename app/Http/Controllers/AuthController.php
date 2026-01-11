<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendCodeRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\User\UserResource;
use App\Mail\SendMail;
use App\Models\Role;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $userRequest = $request->validated();
        $userRequest['password'] = Hash::make($userRequest['password']);

        $code = rand(100000, 999999);
        $expiredCodeAt = now()->addMinutes(10);
        $userRequest['verify_code'] = $code;
        $userRequest['expired_code_at'] = $expiredCodeAt;
        $userRequest['status'] = 'pending';
        
        $role = Role::where('name', 'user')->first();
        $userRequest['role_id'] = $role->id;

        $user = User::create($userRequest);

        Mail::to($user->email)->send(new SendMail($code));

        return response()->json([
            'message' => 'User created successfully',
        ], 201);
    }

    public function verifyCode(VerifyCodeRequest $request)
    {
        $userRequest = $request->validated();
        $user = User::where('email', $userRequest['email'])->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        if ($user->expired_code_at < now()) {
            return response()->json([
                'message' => 'Mã xác thực đã hết hạn',
            ], 400);
        }

        if ($user->verify_code !== $userRequest['code']) {
            return response()->json([
                'message' => 'Mã xác thực không chính xác',
            ], 400);
        }

        $user->status = 'active'; 
        $user->expired_code_at = null;
        $user->verify_code = null;
        $user->save();

        return response()->json([
            'message' => 'Xác thực thành công',
        ], 200);
    }

    public function resendCode(ResendCodeRequest $request)
    {
        $userInput = $request->validated();

        $user = User::where('email', $userInput['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        $code = rand(100000, 999999);
        $expiredCodeAt = now()->addMinutes(5);
        $user->verify_code = $code;
        $user->expired_code_at = $expiredCodeAt;
        $user->save();

        Mail::to($user->email)->send(new SendMail($code));

        return response()->json([
            'message' => 'Đã gửi lại mã thành công',
        ], 200);
    }

    public function login(LoginRequest $request)
    {
        $userRequest = $request->validated();
        $user = User::where('email', $userRequest['email'])->first();

        if (!$user || $user->status !== 'active') {
            return response()->json([
                'message' => 'Tài khoản chưa được xác thực',
            ], 401);
        }

        $checkUser = Hash::check($userRequest['password'], $user->password);

        if (!$user || !$checkUser) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác',
            ], 401);
        }

        $accessToken = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => new UserResource($user),
            'message' => 'Đăng nhập thành công',
            'access_token' => $accessToken,
        ], 200);
    }

    public function getProfile()
    {
        return response()->json([
            'user' => new UserResource(auth()->user()),
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = auth()->user();
        $data = $request->validated();
        
        $user->update($data);
        
        return response()->json([
            'user' => new UserResource($user),
            'message' => 'Update profile successful',
        ], 200);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::where('email', $googleUser->email)->first();

        if (!$user) {
            $role = Role::where('name', 'user')->first();

            $user = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'password' => bcrypt(Str::random(16)),
                'status' => 'active',
                'email_verified_at' => now(),
                'role_id' => $role->id,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return redirect()->to(
            "http://localhost:5173/google-callback?token=$token"
        );
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Vui lòng nhập email',
            'email.email' => 'Email không hợp lệ',
            'email.exists' => 'Email không tồn tại trong hệ thống',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Generate OTP
        $code = rand(100000, 999999);
        $user->verify_code = $code;
        $user->expired_code_at = now()->addMinutes(10);
        $user->save();

        // Send OTP via Mail
        Mail::to($user->email)->send(new SendMail($code));

        return response()->json([
            'message' => 'Mã OTP đã được gửi đến email của bạn.',
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|numeric',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'email.required' => 'Vui lòng nhập email',
            'email.email' => 'Email không hợp lệ',
            'email.exists' => 'Email không tồn tại',
            'code.required' => 'Vui lòng nhập mã OTP',
            'code.numeric' => 'Mã OTP phải là số',
            'password.required' => 'Vui lòng nhập mật khẩu mới',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->verify_code != $request->code) {
             return response()->json(['message' => 'Mã OTP không hợp lệ'], 400);
        }

        if ($user->expired_code_at < now()) {
            return response()->json(['message' => 'Mã OTP đã hết hạn'], 400);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->verify_code = null;
        $user->expired_code_at = null;
        $user->save();

        return response()->json([
            'message' => 'Đặt lại mật khẩu thành công.',
        ], 200);
    }

}