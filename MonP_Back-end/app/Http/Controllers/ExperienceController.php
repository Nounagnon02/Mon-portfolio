<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        try {
            return Experience::orderBy('order')->get();
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    public function show(Experience $experience)
    {
        return $experience;
    }

    public function store(Request $request)
    {
        try {
            return Experience::create($request->all());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Experience $experience)
    {
        $experience->update($request->all());
        return $experience;
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();
        return response()->json(null, 204);
    }
}
