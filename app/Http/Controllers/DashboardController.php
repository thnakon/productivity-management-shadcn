<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\ProductivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $stats = [
            'total_projects' => $user->projects()->count(),
            'total_tasks' => $user->projects()->withCount('tasks')->get()->sum('tasks_count'),
            'tasks_done' => Task::whereHas('project', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->where('status', 'done')->count(),
            'focus_minutes_today' => $user->productivityLogs()
                ->whereDate('date', Carbon::today())
                ->first()?->focus_minutes ?? 0,
        ];

        $recent_projects = $user->projects()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentProjects' => $recent_projects,
        ]);
    }
}
