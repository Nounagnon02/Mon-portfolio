<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index()
    {
        try {
            return response()->json([
                'success' => true,
                'data' => Page::all()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des pages'
            ], 500);
        }
    }

    public function show($pageName)
    {
        try {
            $page = Page::where('page_name', $pageName)
                ->orWhere('id', $pageName)
                ->firstOrFail();
            
            return response()->json([
                'success' => true,
                'data' => $page
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Page non trouvée'
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la page: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'page_name' => 'required|string|unique:pages|max:100',
                'hero_headline' => 'nullable|string|max:500',
                'hero_subheadline' => 'nullable|string|max:1000',
                'hero_background_image' => 'nullable|string',
                'cta_button_text' => 'nullable|string|max:100',
                'cta_button_link' => 'nullable|url'
            ], [
                'page_name.required' => 'Le nom de la page est requis',
                'page_name.unique' => 'Cette page existe déjà',
                'page_name.max' => 'Le nom ne doit pas dépasser 100 caractères',
                'hero_headline.max' => 'Le titre ne doit pas dépasser 500 caractères',
                'hero_subheadline.max' => 'Le sous-titre ne doit pas dépasser 1000 caractères',
                'cta_button_text.max' => 'Le texte du bouton ne doit pas dépasser 100 caractères',
                'cta_button_link.url' => 'Le lien du bouton doit être une URL valide'
            ]);

            $page = Page::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Page créée avec succès',
                'data' => $page
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
                'message' => 'Erreur lors de la création de la page'
            ], 500);
        }
    }

    public function update(Request $request, Page $page)
    {
        try {
            $validated = $request->validate([
                'hero_headline' => 'nullable|string|max:500',
                'hero_subheadline' => 'nullable|string|max:1000',
                'hero_background_image' => 'nullable|string',
                'cta_button_text' => 'nullable|string|max:100',
                'cta_button_link' => 'nullable|url'
            ], [
                'hero_headline.max' => 'Le titre ne doit pas dépasser 500 caractères',
                'hero_subheadline.max' => 'Le sous-titre ne doit pas dépasser 1000 caractères',
                'cta_button_text.max' => 'Le texte du bouton ne doit pas dépasser 100 caractères',
                'cta_button_link.url' => 'Le lien du bouton doit être une URL valide'
            ]);

            $page->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Page mise à jour',
                'data' => $page
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
                'message' => 'Erreur lors de la mise à jour de la page'
            ], 500);
        }
    }

    public function destroy(Page $page)
    {
        try {
            $page->delete();
            return response()->json([
                'success' => true,
                'message' => 'Page supprimée'
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la page'
            ], 500);
        }
    }
}
