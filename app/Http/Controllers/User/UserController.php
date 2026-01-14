<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show()
    {
        return response()->json([
            'user' => new UserResource(auth()->user()),
        ], 200);
    }
}
