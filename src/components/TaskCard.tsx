import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CheckCircle2, Circle, Edit2, Trash2, Rocket, AlignLeft, Image, Clapperboard, Smartphone, Copy, CopyPlus } from 'lucide-react';
import { Task, ContentType } from '../types/TaskTypes';
import { useScheduleStore } from '../store/scheduleStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}

const colorMap = {
  blue: 'border-blue-500/30 text-blue-400',
  purple: 'border-purple-500/30 text-purple-400',
  green: 'border-green-500/30 text-green-400',
  red: 'border-red-500/30 text-red-400',
  orange: 'border-orange-500/30 text-orange-400',
  yellow: 'border-yellow-500/30 text-yellow-400',
};

const bgMap = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
};

const ContentTypeIcon = ({ type, className }: { type: ContentType, className?: string }) => {
  switch (type) {
    case 'Post': return <Image className={className} />;
    case 'Reels': return <Clapperboard className={className} />;
    case 'Story': return <Smartphone className={className} />;
    default: return <Image className={className} />;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit }) => {
  const { toggleTaskCompletion, deleteTask, duplicateTask } = useScheduleStore();
  const [copied, setCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConfirmingDelete) {
      deleteTask(task.id);
    } else {
      setIsConfirmingDelete(true);
      // Reset confirmation state after 3 seconds
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateTask(task.id);
  };

  const handleCopyCaption = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.caption) {
      navigator.clipboard.writeText(task.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "group relative flex flex-col rounded-md border glass-card transition-all duration-300 mb-1.5 overflow-hidden",
            colorMap[task.color],
            snapshot.isDragging ? "opacity-100 z-50 shadow-2xl scale-105 rotate-1 ring-1 ring-white/20" : "hover:bg-white/[0.02] hover:border-white/10"
          )}
        >
          <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-80", bgMap[task.color])} />
          
          {/* Always Visible Row */}
          <div className="flex items-center gap-2 p-1.5 pr-2 pl-2.5">
            <button
              onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }}
              className="shrink-0 hover:scale-110 transition-transform"
            >
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 opacity-40 hover:opacity-100 transition-opacity" />
              )}
            </button>
            
            <span className="text-[10px] font-mono font-medium text-zinc-400 shrink-0">
              {task.time}
            </span>
            
            <span className={cn(
              "text-xs font-medium truncate flex-1",
              task.completed ? "text-zinc-500 line-through" : "text-zinc-100"
            )}>
              {task.title}
            </span>

            {/* Actions & Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <div className="group-hover:hidden flex items-center">
                <ContentTypeIcon type={task.contentType} className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              
              <div className={cn(
                "hidden group-hover:flex items-center gap-0.5 transition-opacity",
                isConfirmingDelete ? "opacity-100" : "opacity-100"
              )}>
                {!isConfirmingDelete && (
                  <>
                    <button onClick={handleDuplicate} className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-zinc-100 transition-colors" title="Duplicar">
                      <CopyPlus className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-zinc-100 transition-colors" title="Editar">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  className={cn(
                    "p-1 rounded transition-all",
                    isConfirmingDelete ? "bg-red-500 text-white" : "hover:bg-red-500/20 text-red-400/70 hover:text-red-400"
                  )}
                  title={isConfirmingDelete ? "Confirmar" : "Excluir"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Details (Inline Accordion) */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
            <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              <div className="p-2 pt-0 pl-8 flex flex-col gap-2">
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded text-zinc-300">
                    <ContentTypeIcon type={task.contentType} className="w-2.5 h-2.5" />
                    {task.contentType}
                  </div>
                  {task.boost?.enabled && (
                    <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
                      <Rocket className="w-2.5 h-2.5" />
                      R$ {task.boost.amount.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Caption */}
                {task.caption && (
                  <div className="mt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Legenda</span>
                      <button onClick={handleCopyCaption} className="text-[9px] flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                        {copied ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-3 bg-black/20 p-1.5 rounded border border-white/5 whitespace-pre-wrap leading-relaxed">
                      {task.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
