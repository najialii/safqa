<?php
namespace App\Http\Controllers;

    use Illuminate\Http\Request;

    class CatController extends Controller
    {
        //

        public function index()
        {

            try {
                $cats = Cat::all();
                return response()->json(['message' => 'Categories retrieved successfully'], $cats);
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to retrieve categories'], 500);
            }
        }


        public function store(Request $request)
    {
        try {
    $request->validate([
        'name' => 'required|string',
        'description' => 'required|string',
    ]);
    Cat::create($request->all());
    return response()->json(['message' => 'Category created successfully'], 201);        
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to create category'], 500);
        }
    }



    public function show($id)
    {
        try {
            $cat = Cat::findOrFail($id);
            return response()->json(['message' => 'Category retrieved successfully'], $cat);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to retrieve category, ' . $th->getMessage()], 500);
        }
    }


        public function update(Request $request, $id)
        {
            try {
                $request->validate([
                    'name' => 'sometimes|required|string',
                    'description' => 'sometimes|required|string',
                ]);

                $cat = Cat::findOrFail($id);
                $cat->update($request->all());

                return response()->json(['message' => 'Category updated successfully'], 200);
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to update category, ' . $th->getMessage()], 500);
            }
        }


        public function destroy($id)
        {
            try {
                $cat = Cat::findOrFail($id);
                $cat->delete();
                return response()->json(['message' => 'Category deleted successfully'], 200);
                
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to delete category, ' . $th->getMessage()], 500);
            }
        }
    }
