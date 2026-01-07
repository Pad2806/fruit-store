<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Http\Requests\Admin\User\CreateRequest;
use App\Models\User;
use App\Models\Role;
use App\Http\Resources\AdminUserResource;

use App\Http\Requests\Admin\User\UpdateRequest;

class AdminUserController extends Controller
{
    public function store(CreateRequest $request)
    {
       $data = $request->validated();
       $role = Role::where('name', $data['role'])->first();
       if (!$role) {
           return response()->json(['error' => 'Role not found'], 404);
       }
       $data['role_id'] = $role->id;
       unset($data['role']);
       $user = User::create($data); 
       return new AdminUserResource($user);
    }

    public function index(Request $request)
    {
        $users = User::orderBy('created_at', 'desc');
        return AdminUserResource::apiPaginate($users, $request);
    }

    public function update(UpdateRequest $request, User $user)
    {
        $data = $request->validated();
        
        if (isset($data['role'])) {
            $role = Role::where('name', $data['role'])->first();
            $data['role_id'] = $role->id;
            unset($data['role']);
        }
        
        $user->update($data);
        return new AdminUserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    public function show(User $user)
    {
        return new AdminUserResource($user);
    }
}
