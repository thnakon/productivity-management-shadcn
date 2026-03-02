<?php

namespace App\Http\Controllers;

use App\Models\ProductivityLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProductivityLogController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'minutes' => 'required|integer|min:1',
        ]);

        $user = auth()->user();
        $today = Carbon::today()->toDateString();

        $log = $user->productivityLogs()->firstOrCreate(
            ['date' => $today],
            ['focus_minutes' => 0, 'tasks_completed' => 0]
        );

        $log->increment('focus_minutes', $validated['minutes']);

        return redirect()->back();
    }
}
