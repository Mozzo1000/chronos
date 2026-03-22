import { useLocation } from 'preact-iso'; // or 'preact-router'
import { LogOut, Calendar as CalendarIcon, Activity, BarChart3 } from 'lucide-preact';

export default function Header() {
  const { url, route } = useLocation();
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });

  return (
    <nav className="sticky top-0 z-30 w-full bg-[#fafafa]/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-6 pt-4 flex flex-col gap-4">
        
        {/* Top Tier: Brand & User */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-black text-2xl tracking-tighter text-slate-950 leading-none">CHRONOS</h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-slate-500">
              <CalendarIcon size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{today}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Tier: Route Navigation */}
        <div className="flex gap-6">
          <a 
            href="/" 
            className={`pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
              url === '/' ? 'text-slate-950 border-slate-950' : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Timeline
          </a>
          <a 
            href="/stats" 
            className={`pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
              url === '/stats' ? 'text-slate-950 border-slate-950' : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Statistics
          </a>
        </div>
      </div>
    </nav>
  );
}