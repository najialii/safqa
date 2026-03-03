<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {

        try {
            $items = item::all();
            return respnse()->json($items);
        } catch (\Throwable $th) {
            $th->getMessage();
             return response()->json(['error' => 'Failed to retrieve items'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'quantity' => 'required|integer',
                'category_id' => 'required|exists:cats,id',
            ]);
            item::create($request->all());
            return response()->json(['message' => 'Item created successfully'], 201);
        } catch (\Throwable $th) {
            $th->getMessage();
             return response()->json(['error' => 'Failed to create item'], 500);
        }
    }


    public function show($id)
    {
        try {
            $item = item::findOrFail($id);
            return response()->json(['message' => 'Item retrieved successfully'], $item);
        } catch (\Throwable $th) {
            $th->getMessage();
             return response()->json(['error' => 'Failed to retrieve item'], 500);
            }
    }


    public function update(Request $request, $id)
{
    try {
        $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'quantity' => 'sometimes|required|integer',
            'category_id' => 'sometimes|required|exists:cats,id',
        ]);

        $item = item::findOrFail($id);
        $item->update($request->all());

        return response()->json(['message' => 'Item updated successfully'], 200);
        
    } catch (\Throwable $th) {
        $th->getMessage();
        return response()->json(['error' => 'Failed to update item'], 500);
    }
}



function destroy($id)
{
    try {
        $item = item::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Item deleted successfully'], 200);
    } catch (\Throwable $th) {
        $th->getMessage();
        return response()->json(['error' => 'Failed to delete item'], 500);
    }
}
 


public function search(Request $request)
{
    try {
        $query = $request->input('query');
        $items = item::where('name', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->get();

        return response()->json($items);
    } catch (\Throwable $th) {
        $th->getMessage();
        return response()->json(['error' => 'Failed to search items'], 500);
    }


    public function filterByCategory($categoryId)
    {
        try {
            $items = item::where('category_id', $categoryId)->get();
            return response()->json($items);
        } catch (\Throwable $th) {
            $th->getMessage();
            return response()->json(['error' => 'Failed to filter items by category'], 500);
        }

    }



        public function filterByPriceRange(Request $request)
        {
            try {
                $minPrice = $request->input('min_price');
                $maxPrice = $request->input('max_price');

                $items = item::whereBetween('price', [$minPrice, $maxPrice])->get();
                return response()->json($items);
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to filter items by price range'], 500);
            }
        }


        public function filterByQuantity(Request $request)
        {
            try {
                $minQuantity = $request->input('min_quantity');
                $maxQuantity = $request->input('max_quantity');

                $items = item::whereBetween('quantity', [$minQuantity, $maxQuantity])->get();
                return response()->json($items);
            } catch (\Throwable $th) {
                $th->getMessage();
                return response()->json(['error' => 'Failed to filter items by quantity'], 500);
            }
        
        
        }

}