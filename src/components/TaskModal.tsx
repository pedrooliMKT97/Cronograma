import React, { useState, useEffect } from 'react';
import { X, Rocket, CheckCircle2, Image, Clapperboard, Smartphone, Layers, Radio, PlaySquare } from 'lucide-react';
import { Task, DayOfWeek, ColorTag, Platform, ContentType } from '../types/TaskTypes';
import { useScheduleStore } from '../store/scheduleStore';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: DayOfWeek;
  taskToEdit?: Task | null;
}

const DAYS: DayOfWeek[] = ['Sábado', 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const COLORS: { value: ColorTag; label: string; class: string }[] = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500 shadow-blue-500/50' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-500 shadow-purple-500/50' },
  { value: 'green', label: 'Verde', class: 'bg-green-500 shadow-green-500/50' },
  { value: 'red', label: 'Vermelho', class: 'bg-red-500 shadow-red-500/50' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-500 shadow-orange-500/50' },
  { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-500 shadow-yellow-500/50' },
];
const PLATFORMS: Platform[] = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Other'];
const CONTENT_TYPES: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: 'Post', label: 'Post', icon: <Image className="w-4 h-4" /> },
  { value: 'Reels', label: 'Reels', icon: <Clapperboard className="w-4 h-4" /> },
  { value: 'Story', label: 'Story', icon: <Smartphone className="w-4 h-4" /> },
];

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, initialDay, taskToEdit }) => {
  const { addTask, updateTask } = useScheduleStore();
  
  const [title, setTitle] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Segunda');
  const [time, setTime] = useState('12:00');
  const [color, setColor] = useState<ColorTag>('blue');
  const [contentType, setContentType] = useState<ContentType>('Post');
  const [caption, setCaption] = useState('');
  
  const [boostEnabled, setBoostEnabled] = useState(false);
  const [boostAmount, setBoostAmount] = useState('');
  const [boostObjective, setBoostObjective] = useState('');
  const [boostPlatform, setBoostPlatform] = useState<Platform>('Instagram');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDay(taskToEdit.day);
        setTime(taskToEdit.time);
        setColor(taskToEdit.color);
        setContentType(taskToEdit.contentType || 'Post');
        setCaption(taskToEdit.caption || '');
        if (taskToEdit.boost?.enabled) {
          setBoostEnabled(true);
          setBoostAmount(taskToEdit.boost.amount.toString());
          setBoostObjective(taskToEdit.boost.objective);
          setBoostPlatform(taskToEdit.boost.platform);
        } else {
          setBoostEnabled(false);
          setBoostAmount('');
          setBoostObjective('');
          setBoostPlatform('Instagram');
        }
      } else {
        setTitle('');
        setDay(initialDay || 'Segunda');
        setTime('12:00');
        setColor('blue');
        setContentType('Post');
        setCaption('');
        setBoostEnabled(false);
        setBoostAmount('');
        setBoostObjective('');
        setBoostPlatform('Instagram');
      }
    }
  }, [isOpen, taskToEdit, initialDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Omit<Task, 'id'> = {
      title,
      day,
      time,
      color,
      contentType,
      caption,
      completed: taskToEdit ? taskToEdit.completed : false,
      boost: boostEnabled ? {
        enabled: true,
        amount: parseFloat(boostAmount) || 0,
        objective: boostObjective,
        platform: boostPlatform,
      } : undefined
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h2>
              <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar">
              <form id="task-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Content Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Formato</label>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setContentType(type.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                          contentType === type.value 
                            ? 'bg-white text-black shadow-lg shadow-white/20 scale-105' 
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                        }`}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Título</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Ex: 5 Dicas de Engajamento"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Dia</label>
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value as DayOfWeek)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                    >
                      {DAYS.map(d => <option key={d} value={d} className="bg-zinc-900">{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Horário</label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Legenda (Opcional)</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                    placeholder="Escreva a legenda do seu post aqui..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Cor da Tag</label>
                  <div className="flex gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-8 h-8 rounded-full ${c.class} ${color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 shadow-lg scale-110' : 'opacity-40 hover:opacity-100 hover:scale-105'} transition-all`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <input
                      type="checkbox"
                      checked={boostEnabled}
                      onChange={(e) => setBoostEnabled(e.target.checked)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${boostEnabled ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                      {boostEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                      <Rocket className={`w-4 h-4 transition-colors ${boostEnabled ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      Impulsionar (Tráfego Pago)
                    </span>
                  </label>

                  <AnimatePresence>
                    {boostEnabled && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                          <div>
                            <label className="block text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-2">Verba (R$)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              required={boostEnabled}
                              value={boostAmount}
                              onChange={(e) => setBoostAmount(e.target.value)}
                              className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              placeholder="50.00"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-2">Plataforma</label>
                              <select
                                value={boostPlatform}
                                onChange={(e) => setBoostPlatform(e.target.value as Platform)}
                                className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                              >
                                {PLATFORMS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-2">Objetivo</label>
                              <input
                                type="text"
                                required={boostEnabled}
                                value={boostObjective}
                                onChange={(e) => setBoostObjective(e.target.value)}
                                className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                placeholder="Ex: Alcance"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-white/[0.02]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="task-form"
                className="px-6 py-2.5 text-sm font-bold bg-white text-black hover:bg-zinc-200 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105"
              >
                Salvar Tarefa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
