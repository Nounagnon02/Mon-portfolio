<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            $validated = $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
                'type' => 'required|string|in:project,page'
            ], [
                'image.required' => 'Une image est requise',
                'image.image' => 'Le fichier doit être une image valide',
                'image.mimes' => 'Les formats acceptés sont: jpeg, png, jpg, gif, webp',
                'image.max' => 'L\'image ne doit pas dépasser 10MB',
                'type.required' => 'Le type d\'image est requis',
                'type.in' => 'Le type doit être project ou page'
            ]);

            $image = $request->file('image');
            $type = $validated['type'];
            
            $imageName = $type . '_' . time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('images', $imageName, 'public');
            
            return response()->json([
                'success' => true,
                'path' => '/storage/' . $path,
                'filename' => $imageName
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement de l\'image'
            ], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $validated = $request->validate([
                'path' => 'required|string'
            ], [
                'path.required' => 'Le chemin du fichier est requis'
            ]);

            $path = str_replace('/storage/', '', $validated['path']);
            
            if (!Storage::disk('public')->exists($path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier non trouvé'
                ], 404);
            }
            
            Storage::disk('public')->delete($path);
            return response()->json([
                'success' => true,
                'message' => 'Image supprimée avec succès'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'image'
            ], 500);
        }
    }
}
