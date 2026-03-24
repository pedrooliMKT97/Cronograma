import React, { useState, useRef } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useScheduleStore } from '../store/scheduleStore';
import { DayOfWeek, Task } from '../types/TaskTypes';
import { DayColumn } from '../components/DayColumn';
import { TaskModal } from '../components/TaskModal';
import { Sidebar } from '../components/Sidebar';
import { Background } from '../components/Background';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS_TOP: DayOfWeek[] = ['Sábado', 'Domingo', 'Segunda', 'Terça'];
const DAYS_BOTTOM: DayOfWeek[] = ['Quarta', 'Quinta', 'Sexta'];

export const Dashboard: React.FC = () => {
  const { tasks, moveTask, filter, clearAllTasks } = useScheduleStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveTask(draggableId, destination.droppableId as DayOfWeek);
  };

  const handleAddTask = (day?: DayOfWeek) => {
    setSelectedDay(day);
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleClearAll = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmClearAll = () => {
    clearAllTasks();
    setIsConfirmModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.color !== 'all' && task.color !== filter.color) return false;
    if (filter.contentType !== 'all' && task.contentType !== filter.contentType) return false;
    if (filter.boostedOnly && !task.boost?.enabled) return false;
    
    // Only hide pending tasks if the user explicitly checked "Apenas Concluídos" (true)
    if (filter.completedOnly === true && !task.completed) return false;
    
    // We intentionally DO NOT hide completed tasks if completedOnly is false or 'all'
    // This ensures completed tasks always show up by default.
    return true;
  });

  return (
    <>
      <Background />
      <div className="flex h-screen text-zinc-100 overflow-hidden font-sans relative z-10">
        <Sidebar />
        
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Header */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 glass-panel z-20">
            <h2 className="text-2xl font-black text-white tracking-tighter">PLANNER</h2>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Tudo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddTask()}
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                <Plus className="w-4 h-4" />
                Nova Tarefa
              </motion.button>
            </div>
          </header>

          {/* Board */}
          <div className="flex-1 overflow-auto p-8 custom-scrollbar relative">
            <DragDropContext onDragEnd={handleDragEnd}>
              <motion.div 
                ref={boardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-[1600px] mx-auto space-y-8 p-4 rounded-3xl"
              >
                {/* Top Row (4 days) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {DAYS_TOP.map(day => (
                    <DayColumn
                      key={day}
                      day={day}
                      tasks={filteredTasks.filter(t => t.day === day)}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                    />
                  ))}
                </div>
                
                {/* Bottom Row (3 days) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:w-3/4">
                  {DAYS_BOTTOM.map(day => (
                    <DayColumn
                      key={day}
                      day={day}
                      tasks={filteredTasks.filter(t => t.day === day)}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                    />
                  ))}
                </div>
              </motion.div>
            </DragDropContext>
          </div>
        </main>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialDay={selectedDay}
          taskToEdit={taskToEdit}
        />

        {/* Custom Confirm Modal for "Delete All" */}
        <AnimatePresence>
          {isConfirmModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsConfirmModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Excluir Tudo?</h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Tem certeza que deseja excluir <strong>TODAS</strong> as tarefas? Esta ação é permanente e não pode ser desfeita.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmClearAll}
                    className="px-5 py-2.5 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    Sim, Excluir Tudo
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
