import React from 'react';
import { useScheduleStore } from '../store/scheduleStore';
import { ColorTag, ContentType } from '../types/TaskTypes';
import { Filter, Rocket, CheckSquare, CalendarDays, Image, Clapperboard, Smartphone } from 'lucide-react';

const COLORS: { value: ColorTag | 'all'; label: string; class: string }[] = [
  { value: 'all', label: 'Todas', class: 'bg-zinc-700' },
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'red', label: 'Vermelho', class: 'bg-red-500' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-500' },
  { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-500' },
];

const CONTENT_TYPES: { value: ContentType | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'Todos', icon: <Filter className="w-3 h-3" /> },
  { value: 'Post', label: 'Post', icon: <Image className="w-3 h-3" /> },
  { value: 'Reels', label: 'Reels', icon: <Clapperboard className="w-3 h-3" /> },
  { value: 'Story', label: 'Story', icon: <Smartphone className="w-3 h-3" /> },
];

export const Sidebar: React.FC = () => {
  const { filter, setFilter, tasks } = useScheduleStore();

  const totalBoost = tasks.reduce((sum, task) => {
    if (task.boost?.enabled) {
      return sum + task.boost.amount;
    }
    return sum;
  }, 0);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="w-72 glass-panel border-r border-white/5 h-screen flex flex-col p-5 overflow-y-auto shrink-0 z-20">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <CalendarDays className="w-6 h-6 text-black" />
        </div>
        <h1 className="font-bold text-2xl tracking-tight text-white">PLANNER</h1>
      </div>

      <div className="space-y-8">
        {/* Progress */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Progresso</span>
              <span className="text-sm font-bold text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-3 font-medium">
              <span className="text-zinc-300">{completedTasks}</span> de <span className="text-zinc-300">{totalTasks}</span> tarefas concluídas
            </p>
          </div>
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Filtros</h3>
            </div>
            {(filter.color !== 'all' || filter.contentType !== 'all' || filter.boostedOnly || filter.completedOnly === true) && (
              <button
                onClick={() => setFilter({ color: 'all', contentType: 'all', boostedOnly: false, completedOnly: 'all' })}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-wider font-bold transition-colors"
                title="Limpar todos os filtros"
              >
                Limpar
              </button>
            )}
          </div>
          
          <div className="space-y-6 px-2">
            {/* Content Type Filter */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Formato</label>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFilter({ contentType: filter.contentType === type.value ? 'all' : type.value })}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filter.contentType === type.value 
                        ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Cor</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setFilter({ color: filter.color === c.value ? 'all' : c.value })}
                    className={`w-6 h-6 rounded-full ${c.class} ${filter.color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110 shadow-lg' : 'opacity-30 hover:opacity-100 hover:scale-110'} transition-all duration-300`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filter.boostedOnly}
                  onChange={(e) => setFilter({ boostedOnly: e.target.checked })}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 ${filter.boostedOnly ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                  {filter.boostedOnly && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Apenas Impulsionados</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filter.completedOnly === true}
                  onChange={(e) => setFilter({ completedOnly: e.target.checked ? true : 'all' })}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 ${filter.completedOnly === true ? 'bg-blue-500 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                  {filter.completedOnly === true && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Apenas Concluídos</span>
              </label>
            </div>
          </div>
        </div>

        {/* Boost Summary */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 rounded-2xl p-5 border border-emerald-500/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/30 transition-colors duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Tráfego Pago</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">
              R$ {totalBoost.toFixed(2)}
            </div>
            <p className="text-xs text-emerald-400/60 mt-2 font-medium">Total investido na semana</p>
          </div>
        </div>
      </div>
    </div>
  );
};
