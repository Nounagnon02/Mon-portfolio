<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::orderBy('order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'technologies' => 'required|array',
            'category' => 'required|string',
            'live_url' => 'nullable|string',
            'github_url' => 'nullable|string',
            'order' => 'nullable|integer'
        ]);

        return Project::create($validated);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'string',
            'description' => 'string',
            'image' => 'nullable|string',
            'technologies' => 'array',
            'category' => 'string',
            'live_url' => 'nullable|string',
            'github_url' => 'nullable|string',
            'order' => 'nullable|integer'
        ]);

        $project->update($validated);
        return $project;
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
