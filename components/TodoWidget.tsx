import React, { useState, useEffect } from 'react';
import { Plus, X, CheckSquare } from 'lucide-react';

export const TodoWidget: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard_tasks');
    return saved ? JSON.parse(saved) : ['Pray Fajr', 'Read Quran'];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Input Area */}
      <form onSubmit={addTask} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add task..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder-white/40"
        />
        <button 
          type="submit"
          className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 p-1.5 rounded-lg transition-colors border border-emerald-500/30"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-2">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/30 text-xs italic">
            <CheckSquare size={24} className="mb-2 opacity-50" />
            No tasks for today
          </div>
        ) : (
          tasks.map((task, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg p-2 border border-white/5 transition-all"
            >
              <span className="text-sm text-white/90 font-light truncate mr-2">{task}</span>
              <button 
                onClick={() => removeTask(index)}
                className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};