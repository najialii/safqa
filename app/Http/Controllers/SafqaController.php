<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SafqaController extends Controller
{
    //

    public function index()
    {
        try {
            $safqas = safqa::all();
            return response()->json(['message' => 'Safqas retrieved successfully'], $safqas);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to retrieve safqas'], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'description' => 'required|string',
            ]);
            safqa::create($request->all());
            return response()->json(['message' => 'Safqa created successfully'], 201);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to create safqa'], 500);
        }
    }


    public function show($id)
    {
        try {
            $safqa = safqa::findOrFail($id);
            return response()->json(['message' => 'Safqa retrieved successfully'], $safqa);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to retrieve safqa, ' . $th->getMessage()], 500);
        }
    }



    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'sometimes|required|string',
                'description' => 'sometimes|required|string',
            ]);

            $safqa = safqa::findOrFail($id);
            $safqa->update($request->all());

            return response()->json(['message' => 'Safqa updated successfully'], 200);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to update safqa, ' . $th->getMessage()], 500);
        }
    }


        public function destroy($id)
        {
            try {
                $safqa = safqa::findOrFail($id);
                $safqa->delete();
                return response()->json(['message' => 'Safqa deleted successfully'], 200);
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to delete safqa, ' . $th->getMessage()], 500);
            }
        }   

        public function search(Request $request)
        {
            try {
                $query = $request->input('query');
                $safqas = safqa::where('name', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%')
                    ->get();
                return response()->json(['message' => 'Safqas retrieved successfully'], $safqas);
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to search safqas, ' . $th->getMessage()], 500);
            }
        }


        public function mySafqas(Request $request)
        {
            try {
                $user = $request->user();
                $safqas = safqa::where('user_id', $user->id)->get();
                return response()->json(['message' => 'User safqas retrieved successfully'], $safqas);
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to retrieve user safqas, ' . $th->getMessage()], 500);
            }
        }
}
