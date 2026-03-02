import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CheckCircle2, LayoutDashboard, Timer, Play, Pause, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import productivityLogsRoutes from '@/routes/productivity-logs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface DashboardProps {
    stats: {
        total_projects: number;
        total_tasks: number;
        tasks_done: number;
        focus_minutes_today: number;
    };
    recentProjects: any[];
}

export default function Dashboard({ stats, recentProjects }: DashboardProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const { post, processing } = useForm({
        minutes: 25,
    });

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resetTimer = () => {
        setTimeLeft(25 * 60);
        setIsActive(false);
    };

    const logSession = () => {
        post(productivityLogsRoutes.store.url(), {
            onSuccess: () => {
                resetTimer();
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_projects}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tasks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.tasks_done}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Focus Today</CardTitle>
                            <Timer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.focus_minutes_today}m</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Timer className="h-5 w-5" /> Pomodoro Timer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center space-y-6 py-4">
                            <div className="text-6xl font-bold tracking-tighter">
                                {formatTime(timeLeft)}
                            </div>
                            <Progress value={(timeLeft / (25 * 60)) * 100} className="w-full" />
                            <div className="flex gap-2">
                                <Button size="icon" variant="outline" onClick={() => setIsActive(!isActive)}>
                                    {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button size="icon" variant="outline" onClick={resetTimer}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                                <Button variant="secondary" onClick={logSession} disabled={processing || timeLeft > 0}>
                                    <Save className="mr-2 h-4 w-4" /> Log Session
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProjects.length > 0 ? (
                                    recentProjects.map((project) => (
                                        <div key={project.id} className="flex items-center gap-4">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">{project.name}</p>
                                                <p className="text-sm text-muted-foreground">{project.status}</p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No projects found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
