<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show($pageName)
    {
        $page = Page::where('page_name', $pageName)->firstOrFail();
        return $page;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'page_name' => 'required|string|unique:pages',
            'hero_headline' => 'nullable|string',
            'hero_subheadline' => 'nullable|string',
            'hero_background_image' => 'nullable|string',
            'cta_button_text' => 'nullable|string',
            'cta_button_link' => 'nullable|string'
        ]);

        return Page::create($validated);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'hero_headline' => 'nullable|string',
            'hero_subheadline' => 'nullable|string',
            'hero_background_image' => 'nullable|string',
            'cta_button_text' => 'nullable|string',
            'cta_button_link' => 'nullable|string'
        ]);

        $page->update($validated);
        return $page;
    }
}
