<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        return response()->json(Experience::orderBy('order')->get());
    }

    public function show($id)
    {
        $experience = Experience::findOrFail($id);
        return response()->json($experience);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:professional,competition,hackathon,education',
            'title' => 'required|string',
            'company' => 'required|string',
            'position' => 'nullable|string',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'is_current' => 'nullable|boolean',
            'order' => 'nullable|integer'
        ]);

        $experience = Experience::create($validated);
        return response()->json($experience, 201);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::findOrFail($id);
        
        $validated = $request->validate([
            'type' => 'sometimes|in:professional,competition,hackathon,education',
            'title' => 'sometimes|string',
            'company' => 'sometimes|string',
            'position' => 'nullable|string',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'is_current' => 'nullable|boolean',
            'order' => 'nullable|integer'
        ]);

        $experience->update($validated);
        return response()->json($experience);
    }

    public function destroy($id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();
        return response()->json(null, 204);
    }
}
