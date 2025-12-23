import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Play, Pause, Square, CheckSquare, ArrowLeft } from 'lucide-react';

interface Task {
    text: string;
    completed: boolean;
}

export const TaskFocusWidget: React.FC = () => {
    // --- STATE ---
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('dashboard_tasks_v2');
        return saved ? JSON.parse(saved) : [{ text: 'Pray Fajr', completed: false }];
    });
    const [newTask, setNewTask] = useState('');
    const [view, setView] = useState<'list' | 'focus'>('list');
    const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

    // Timer State
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem('dashboard_tasks_v2', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    // --- HANDLERS (Task) ---
    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            setTasks([...tasks, { text: newTask.trim(), completed: false }]);
            setNewTask('');
        }
    };

    const removeTask = (index: number) => {
        if (activeTaskIndex === index) {
            // If deleting active task, exit focus mode
            exitFocusMode();
        }
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
        if (activeTaskIndex !== null && index < activeTaskIndex) {
            setActiveTaskIndex(activeTaskIndex - 1);
        }
    };

    const startFocus = (index: number) => {
        setActiveTaskIndex(index);
        setView('focus');
        setTime(0);
        setIsRunning(true);
    };

    // --- HANDLERS (Timer) ---
    const toggleTimer = () => setIsRunning(!isRunning);

    const exitFocusMode = () => {
        setIsRunning(false);
        setView('list');
        setActiveTaskIndex(null);
    };

    const completeTask = () => {
        if (activeTaskIndex !== null) {
            // Mark complete or remove? Let's remove for now as per typical "Focus done" flow
            // or maybe toggle completed. Let's toggle completed.
            const newTasks = [...tasks];
            newTasks[activeTaskIndex].completed = true;
            setTasks(newTasks);
        }
        exitFocusMode();
    };

    // --- RENDER HELPERS ---
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return { h, m, s };
    };

    const { h, m, s } = formatTime(time);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    // 1 hour progress for visual ring
    const progress = (time % 3600) / 3600;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className="h-full w-full relative overflow-hidden">

            {/* --- LIST VIEW --- */}
            <div className={`absolute inset-0 flex flex-col transition-all duration-500 transform ${view === 'list' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
                {/* Input */}
                <form onSubmit={addTask} className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add task..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder-white/40"
                    />
                    <button type="submit" className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                        <Plus size={14} />
                    </button>
                </form>

                {/* List */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-white/30 text-xs italic">
                            No tasks yet.
                        </div>
                    )}
                    {tasks.map((task, idx) => (
                        <div key={idx} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg p-2 border border-white/5 transition-all">
                            <span className={`text-sm text-white/90 font-light truncate mr-2 ${task.completed ? 'line-through opacity-50' : ''}`}>
                                {task.text}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => startFocus(idx)}
                                    className="text-emerald-400 hover:text-emerald-300 p-1"
                                    title="Focus Mode"
                                >
                                    <Play size={12} />
                                </button>
                                <button
                                    onClick={() => removeTask(idx)}
                                    className="text-white/20 hover:text-red-400 p-1"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FOCUS VIEW --- */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 transform ${view === 'focus' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>

                {/* Back Button */}
                <button
                    onClick={exitFocusMode}
                    className="absolute top-0 left-0 text-white/40 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                </button>

                {/* Active Task Name */}
                <div className="absolute top-0 w-full text-center px-6">
                    <span className="text-xs text-emerald-400 uppercase tracking-widest font-bold">Focusing On</span>
                    <p className="text-sm text-white/90 truncate mt-1">
                        {activeTaskIndex !== null && tasks[activeTaskIndex]?.text}
                    </p>
                </div>

                {/* Timer Ring */}
                <div className="relative mt-6 mb-4">
                    <svg className="transform -rotate-90 w-32 h-32">
                        <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle
                            cx="50%" cy="50%" r={radius} fill="transparent" stroke="#34d399" strokeWidth="4"
                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        <div className="text-2xl font-bold text-white tracking-wide">
                            {view === 'focus' ? `${h}:${m}` : '00:00'}
                        </div>
                        <div className="text-xs text-white/40">.{s}</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRunning ? 'bg-white/10 text-white' : 'bg-emerald-500 text-black'}`}
                    >
                        {isRunning ? <Pause size={18} /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button
                        onClick={completeTask}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-white/10"
                        title="Complete Task"
                    >
                        <CheckSquare size={18} />
                    </button>
                </div>
            </div>

        </div>
    );
};
