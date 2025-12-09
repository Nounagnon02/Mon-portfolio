<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        try {
            return response()->json([
                'success' => true,
                'data' => Project::orderBy('order')->get()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des projets'
            ], 500);
        }
    }

    public function show(Project $project)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $project
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:2000',
                'image' => 'nullable|string',
                'technologies' => 'required|array|min:1',
                'category' => 'required|string|max:100',
                'live_url' => 'nullable|url',
                'github_url' => 'nullable|url',
                'order' => 'nullable|integer|min:0'
            ], [
                'title.required' => 'Le titre est requis',
                'title.max' => 'Le titre ne doit pas dépasser 255 caractères',
                'description.required' => 'La description est requise',
                'description.max' => 'La description ne doit pas dépasser 2000 caractères',
                'technologies.required' => 'Au moins une technologie est requise',
                'technologies.min' => 'Au moins une technologie est requise',
                'category.required' => 'La catégorie est requise',
                'live_url.url' => 'L\'URL du site doit être valide',
                'github_url.url' => 'L\'URL GitHub doit être valide'
            ]);

            $project = Project::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Projet créé avec succès',
                'data' => $project
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
                'message' => 'Erreur lors de la création du projet'
            ], 500);
        }
    }

    public function update(Request $request, Project $project)
    {
        try {
            $validated = $request->validate([
                'title' => 'string|max:255',
                'description' => 'string|max:2000',
                'image' => 'nullable|string',
                'technologies' => 'array|min:1',
                'category' => 'string|max:100',
                'live_url' => 'nullable|url',
                'github_url' => 'nullable|url',
                'order' => 'nullable|integer|min:0'
            ], [
                'title.max' => 'Le titre ne doit pas dépasser 255 caractères',
                'description.max' => 'La description ne doit pas dépasser 2000 caractères',
                'technologies.min' => 'Au moins une technologie est requise',
                'category.max' => 'La catégorie ne doit pas dépasser 100 caractères',
                'live_url.url' => 'L\'URL du site doit être valide',
                'github_url.url' => 'L\'URL GitHub doit être valide'
            ]);

            $project->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Projet mis à jour',
                'data' => $project
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
                'message' => 'Erreur lors de la mise à jour du projet'
            ], 500);
        }
    }

    public function destroy(Project $project)
    {
        try {
            $project->delete();
            return response()->json([
                'success' => true,
                'message' => 'Projet supprimé'
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du projet'
            ], 500);
        }
    }
}
