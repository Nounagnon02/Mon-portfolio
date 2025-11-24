<?php

namespace App\Http\Controllers;

use App\Models\pags;
use Illuminate\Http\Request;

class PagsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(pags::all());
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
            'page_name' => 'required|string',
            'hero_headline' => 'nullable|string',
            'hero_subheadline' => 'nullable|string',
            'hero_background_image' => 'nullable|string|max:255', // Image path
            'cta_button_text' => 'nullable|string',
            'cta_button_link' => 'nullable|string'
        ]);

        $page = pags::create($validated);
        return response()->json($page, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\pags  $pags
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $page = pags::where('id', $id)->orWhere('page_name', $id)->firstOrFail();
        return response()->json($page);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\pags  $pags
     * @return \Illuminate\Http\Response
     */
    public function edit(pags $pags)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\pags  $pags
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $page = pags::where('id', $id)->orWhere('page_name', $id)->firstOrFail();
        
        $validated = $request->validate([
            'hero_headline' => 'nullable|string',
            'hero_subheadline' => 'nullable|string',
            'hero_background_image' => 'nullable|string|max:255', // Image path
            'cta_button_text' => 'nullable|string',
            'cta_button_link' => 'nullable|string'
        ]);

        $page->update($validated);
        return response()->json($page);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\pags  $pags
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $page = pags::findOrFail($id);
        $page->delete();
        return response()->json(null, 204);
    }
}
