<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        
        $user = DB::table('users')->insertGetId([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], 
        ]);

        if(!$user){
            return response()->json(['message' => 'Invalid data'], 400);
        }

        return response()->json([
            'message' => 'User registered successfully',
            'userId' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = DB::table('users')->where('email', $validated['email'])->first();

        if (!$user || $validated['password'] !==  $user->password) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'userId' => $user->id
        ]);
    }
}
