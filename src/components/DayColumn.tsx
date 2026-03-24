import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { DayOfWeek, Task } from '../types/TaskTypes';
import { TaskCard } from './TaskCard';
import { sortTasksByTime } from '../utils/timeSorter';
import { Plus } from 'lucide-react';

interface DayColumnProps {
  day: DayOfWeek;
  tasks: Task[];
  onAddTask: (day: DayOfWeek) => void;
  onEditTask: (task: Task) => void;
}

const getTodayString = (): DayOfWeek => {
  const days: DayOfWeek[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[new Date().getDay()];
};

export const DayColumn: React.FC<DayColumnProps> = ({ day, tasks, onAddTask, onEditTask }) => {
  const sortedTasks = sortTasksByTime(tasks);
  const isToday = day === getTodayString();

  return (
    <div className={`flex flex-col h-full glass-panel rounded-2xl transition-all duration-300 ${
      isToday ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-blue-500/[0.02]' : 'hover:border-white/10'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between sticky top-0 z-10 rounded-t-2xl backdrop-blur-md ${
        isToday ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5'
      }`}>
        <h2 className={`font-bold uppercase tracking-widest text-xs flex items-center gap-2 ${
          isToday ? 'text-blue-400' : 'text-zinc-100'
        }`}>
          {day}
          {isToday && (
            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-sm font-black">
              HOJE
            </span>
          )}
        </h2>
        <button
          onClick={() => onAddTask(day)}
          className={`p-1.5 rounded-lg transition-colors ${
            isToday ? 'text-blue-400 hover:bg-blue-500/20 hover:text-blue-300' : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-100'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={day}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[150px] transition-colors duration-300 rounded-b-2xl ${
              snapshot.isDraggingOver ? 'bg-white/[0.03]' : ''
            }`}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
              />
            ))}
            {provided.placeholder}
            
            {sortedTasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-sm border-2 border-dashed border-white/5 rounded-xl p-6 opacity-50 hover:opacity-100 transition-opacity">
                <p className="mb-2 text-xs">Nenhuma tarefa</p>
                <button 
                  onClick={() => onAddTask(day)}
                  className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Adicionar
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
