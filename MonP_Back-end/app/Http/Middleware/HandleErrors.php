<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HandleErrors
{
    public function handle(Request $request, Closure $next)
    {
        try {
            return $next($request);
        } catch (\Exception $e) {
            \Log::error('API Error: ' . $e->getMessage(), [
                'url' => $request->url(),
                'method' => $request->method(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
