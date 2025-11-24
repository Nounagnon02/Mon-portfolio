<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'type' => 'required|string|in:project,page'
        ]);

        $image = $request->file('image');
        $type = $request->input('type');
        
        // Générer un nom unique pour l'image
        $imageName = $type . '_' . time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
        
        // Stocker l'image dans le dossier public/images
        $path = $image->storeAs('images', $imageName, 'public');
        
        return response()->json([
            'success' => true,
            'path' => '/storage/' . $path,
            'filename' => $imageName
        ]);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $path = str_replace('/storage/', '', $request->input('path'));
        
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'File not found'], 404);
    }
}