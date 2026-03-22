import { TRACKING_CONFIG } from '../config';
import { Plus } from 'lucide-preact';
import IconRenderer from './IconRenderer';

export default function FAB({ onAction }) {
  const shortcuts = TRACKING_CONFIG.filter(item => item.shortcut);

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-center z-40 pointer-events-none">     
      <div className="flex flex-col-reverse gap-4 mb-4 pointer-events-auto">
        {shortcuts.map((item) => (
          <div key={item.key} className="relative flex items-center gap-4 group justify-end">
            <span className="hidden md:block absolute right-14 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
            
            <button
              onClick={() => onAction(item.key)}
              className="w-12 h-12 bg-white border border-slate-200 shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-110 active:scale-90 transition-all hover:border-slate-400 bg-opacity-90 backdrop-blur-md"
              title={item.label}
            >
              <IconRenderer name={item.icon} size={20} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onAction(null)}
        className="pointer-events-auto w-16 h-16 bg-slate-900 text-white shadow-2xl rounded-full flex items-center justify-center hover:bg-black transition-all active:scale-95 group"
      >
        <Plus 
          size={32} 
          strokeWidth={2.5} 
          className="group-hover:rotate-90 transition-transform duration-300" 
        />
      </button>
    </div>
  );
}