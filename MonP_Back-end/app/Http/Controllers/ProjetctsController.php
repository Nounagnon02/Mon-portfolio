<?php

namespace App\Http\Controllers;

use App\Models\projetcts;
use Illuminate\Http\Request;

class ProjetctsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(projetcts::orderBy('order')->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|string|max:255', // Image path
            'technologies' => 'required|array',
            'category' => 'required|string',
            'live_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'order' => 'nullable|integer'
        ]);

        $project = projetcts::create($validated);
        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\projetcts  $projetcts
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $project = projetcts::findOrFail($id);
        return response()->json($project);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\projetcts  $projetcts
     * @return \Illuminate\Http\Response
     */
    public function edit(projetcts $projetcts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\projetcts  $projetcts
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $project = projetcts::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'image' => 'nullable|string|max:255', // Image path
            'technologies' => 'sometimes|array',
            'category' => 'sometimes|string',
            'live_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'order' => 'nullable|integer'
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\projetcts  $projetcts
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $project = projetcts::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }
}
