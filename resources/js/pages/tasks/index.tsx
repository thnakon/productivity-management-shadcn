import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, MoreHorizontal, Trash2, Edit, AlertCircle, Clock, CheckCircle2, List, Layout, Info } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import tasksRoutes from '@/routes/tasks';

interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'todo' | 'in_progress' | 'done';
    project: {
        id: number;
        name: string;
    };
}

interface Project {
    id: number;
    name: string;
}

interface TasksProps {
    tasks: Task[];
    projects: Project[];
}

export default function Tasks({ tasks, projects }: TasksProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data, setData, post, processing, reset, patch, delete: destroy } = useForm({
        project_id: '',
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(tasksRoutes.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const toggleStatus = (task: Task) => {
        const nextStatus = task.status === 'done' ? 'todo' : 'done';
        patch(tasksRoutes.update.url(task.id), {
            status: nextStatus,
        } as any);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tasks', href: '/tasks' }]}>
            <Head title="Tasks" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                        <p className="text-muted-foreground">Focus on your individual actions and to-dos.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Task</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 py-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Project</Label>
                                        <Select onValueChange={(val) => setData('project_id', val)} value={data.project_id}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projects.map((project) => (
                                                    <SelectItem key={project.id} value={project.id.toString()}>
                                                        {project.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Task Title</Label>
                                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Priority</Label>
                                        <Select onValueChange={(val) => setData('priority', val as any)} value={data.priority}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={processing || !data.project_id}>
                                    Add Task
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs defaultValue="list" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="list" className="flex gap-2">
                            <List className="h-4 w-4" /> List
                        </TabsTrigger>
                        <TabsTrigger value="board" className="flex gap-2">
                            <Layout className="h-4 w-4" /> Board (Soon)
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="list" className="space-y-4">
                        <div className="flex flex-col gap-2">
                            {tasks.map((task) => (
                                <Card key={task.id} className={task.status === 'done' ? 'opacity-60' : ''}>
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <Checkbox checked={task.status === 'done'} onCheckedChange={() => toggleStatus(task)} />
                                            <div className="space-y-1">
                                                <p className={`text-sm font-medium leading-none ${task.status === 'done' ? 'line-through' : ''}`}>
                                                    {task.title}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] uppercase">{task.project.name}</Badge>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                                                        {task.priority === 'urgent' && <AlertCircle className="h-3 w-3 text-destructive" />}
                                                        {task.priority}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Info className="h-4 w-4" />
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Task Details</SheetTitle>
                                                        <SheetDescription>View properties for "{task.title}"</SheetDescription>
                                                    </SheetHeader>
                                                    <div className="mt-6 space-y-4">
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-medium">Status</h4>
                                                            <Badge>{task.status}</Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-medium">Priority</h4>
                                                            <Badge variant="secondary">{task.priority}</Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-medium">Project</h4>
                                                            <p className="text-sm text-muted-foreground">{task.project.name}</p>
                                                        </div>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => destroy(tasksRoutes.destroy.url(task.id))}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="board">
                        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                            Kanban board view coming soon!
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

