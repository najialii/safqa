<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);

            return response()->json(['message' => 'User registered successfully'], 201);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to register user'], 500);
        }
    }


    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['message' => 'User logged in successfully', 'token' => $token], 200);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to log in user'], 500);
        }
    }


    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'User logged out successfully'], 200);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to log out user'], 500);
        }
    }
}
