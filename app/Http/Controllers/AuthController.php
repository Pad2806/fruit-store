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
                'message' => 'User not found',
            ], 404);
        }

        if ($user->expired_code_at < now()) {
            return response()->json([
                'message' => 'Code has expired',
            ], 400);
        }

        if ($user->verify_code !== $userRequest['code']) {
            return response()->json([
                'message' => 'Code is incorrect',
            ], 400);
        }

        $user->status = 'active'; 
        $user->expired_code_at = null;
        $user->verify_code = null;
        $user->save();

        return response()->json([
            'message' => 'Code verified successfully',
        ], 200);
    }

    public function resendCode(ResendCodeRequest $request)
    {
        $userInput = $request->validated();

        $user = User::where('email', $userInput['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $code = rand(100000, 999999);
        $expiredCodeAt = now()->addMinutes(5);
        $user->verify_code = $code;
        $user->expired_code_at = $expiredCodeAt;
        $user->save();

        Mail::to($user->email)->send(new SendMail($code));

        return response()->json([
            'message' => 'Code resent successfully',
        ], 200);
    }

    public function login(LoginRequest $request)
    {
        $userRequest = $request->validated();
        $user = User::where('email', $userRequest['email'])->first();

        if (!$user || $user->status !== 'active') {
            return response()->json([
                'message' => 'User not verified',
            ], 401);
        }

        $checkUser = Hash::check($userRequest['password'], $user->password);

        if (!$user || !$checkUser) {
            return response()->json([
                'message' => 'Password or email is incorrect',
            ], 401);
        }

        $accessToken = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => new UserResource($user),
            'message' => 'Login successful',
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

}