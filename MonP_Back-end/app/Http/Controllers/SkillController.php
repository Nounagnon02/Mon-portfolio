<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        return response()->json(Skill::orderBy('category')->orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'name' => 'required|string',
            'order' => 'nullable|integer'
        ]);

        $skill = Skill::create($validated);
        return response()->json($skill, 201);
    }

    public function update(Request $request, $id)
    {
        $skill = Skill::findOrFail($id);
        
        $validated = $request->validate([
            'category' => 'sometimes|string',
            'name' => 'sometimes|string',
            'order' => 'nullable|integer'
        ]);

        $skill->update($validated);
        return response()->json($skill);
    }

    public function destroy($id)
    {
        $skill = Skill::findOrFail($id);
        $skill->delete();
        return response()->json(null, 204);
    }
}
