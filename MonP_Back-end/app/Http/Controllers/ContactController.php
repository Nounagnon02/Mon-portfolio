<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        try {
            return Contact::orderBy('created_at', 'desc')->get();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des contacts'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:5000'
            ], [
                'name.required' => 'Le nom est requis',
                'name.max' => 'Le nom ne doit pas dépasser 255 caractères',
                'email.required' => 'L\'email est requis',
                'email.email' => 'L\'email doit être valide',
                'email.max' => 'L\'email ne doit pas dépasser 255 caractères',
                'subject.required' => 'Le sujet est requis',
                'subject.max' => 'Le sujet ne doit pas dépasser 255 caractères',
                'message.required' => 'Le message est requis',
                'message.max' => 'Le message ne doit pas dépasser 5000 caractères'
            ]);

            $contact = Contact::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Message reçu avec succès',
                'data' => $contact
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
                'message' => 'Erreur lors de l\'envoi du message'
            ], 500);
        }
    }

    public function markAsRead(Contact $contact)
    {
        try {
            $contact->update(['is_read' => true]);
            return response()->json([
                'success' => true,
                'message' => 'Message marqué comme lu',
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }

    public function show(Contact $contact)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact non trouvé'
            ], 404);
        }
    }

    public function update(Request $request, Contact $contact)
    {
        try {
            $validated = $request->validate([
                'is_read' => 'boolean'
            ]);

            $contact->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Contact mis à jour',
                'data' => $contact
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
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }

    public function destroy(Contact $contact)
    {
        try {
            $contact->delete();
            return response()->json([
                'success' => true,
                'message' => 'Contact supprimé'
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }
}
