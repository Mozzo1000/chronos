import { useState, useEffect } from 'preact/hooks';
import pb from '../lib/pocketbase';
import { TRACKING_CONFIG } from '../config';
import IconRenderer from './IconRenderer';
import { ChevronDown, ChevronUp, RotateCcw, Clock } from 'lucide-preact';

export default function LogEntry({ isOpen, onClose, initialKey }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKey, setSelectedKey] = useState(TRACKING_CONFIG[0].key);
  const [value, setValue] = useState('');
  const [eventAt, setEventAt] = useState(new Date().toISOString().slice(0, 16));

  const visibleMetrics = isExpanded ? TRACKING_CONFIG : TRACKING_CONFIG.slice(0, 4);

  useEffect(() => {
    if (isOpen && initialKey) {
      setSelectedKey(initialKey);
      if (!TRACKING_CONFIG.slice(0, 4).find(m => m.key === initialKey)) {
        setIsExpanded(true);
      }
    } else if (isOpen) {
      setSelectedKey(TRACKING_CONFIG[0].key);
      setIsExpanded(false);
      // Reset to current time on open
      setEventAt(new Date().toISOString().slice(0, 16));
    }
  }, [isOpen, initialKey]);

  // Helper to jump to yesterday
  const setToYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setEventAt(d.toISOString().slice(0, 16));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        key: selectedKey,
        value: value.toString(),
        source: 'manual',
        event_at: new Date(eventAt).toISOString(),
        category: TRACKING_CONFIG.find(c => c.key === selectedKey)?.category || 'general'
      };
      await pb.collection('logs').create(data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setValue('');
        onClose();
      }, 1000);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full h-[92%] md:h-auto md:max-w-3xl bg-white rounded-none md:rounded-sm shadow-2xl overflow-y-auto transition-all duration-300">
        
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 border-b border-slate-100 flex justify-between items-center z-10">
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 px-2 text-xs font-bold uppercase tracking-widest">
            Cancel
          </button>
          <h2 className="font-black text-slate-950 tracking-tighter uppercase text-sm">New Entry</h2>
          <div className="w-16"></div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            
            {/* Metric Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Select Metric</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleMetrics.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedKey(item.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border-2 transition-all ${
                      selectedKey === item.key 
                      ? 'border-slate-950 bg-slate-950 text-white shadow-md' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <IconRenderer name={item.icon} size={16} strokeWidth={2.5} />
                    <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-sm border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-400 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span className="text-xs font-bold uppercase">{isExpanded ? 'Less' : 'More'}</span>
                </button>
              </div>
            </div>

            {/* Value Input */}
            <div className="bg-slate-50 p-6 rounded-sm border border-slate-100">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-4">
                Record {TRACKING_CONFIG.find(c => c.key === selectedKey).label}
              </label>
              
              {TRACKING_CONFIG.find(c => c.key === selectedKey).type === 'select' ? (
                <div className="grid grid-cols-2 gap-3">
                  {TRACKING_CONFIG.find(c => c.key === selectedKey).options.map(opt => (
                    <button
                      type="button"
                      onClick={() => setValue(opt)}
                      className={`p-4 rounded-sm border-2 transition-all text-xs font-bold uppercase tracking-widest ${
                        value === opt 
                        ? 'border-slate-950 bg-white text-slate-950 shadow-sm' 
                        : 'border-transparent bg-slate-200/50 text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={value}
                    onInput={(e) => setValue(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-slate-200 focus:border-slate-950 text-5xl font-black outline-none transition-colors py-2 text-slate-950 tabular-nums"
                    placeholder="00"
                    required
                  />
                </div>
              )}
            </div>

            {/* Timestamp with Large Touch Targets */}
            <div className="px-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                Entry Timing
              </label>
              
                {/* Segmented Control for Quick Date Jumps */}
                <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
                  <button 
                    type="button"
                    onClick={setToYesterday}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-sm hover:border-slate-950 transition-all active:bg-slate-50"
                  >
                    <RotateCcw size={14} strokeWidth={2.5} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Yesterday</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setEventAt(new Date().toISOString().slice(0, 16))}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-sm hover:border-slate-950 transition-all active:bg-slate-50"
                  >
                    <Clock size={14} strokeWidth={2.5} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Today</span>
                  </button>
                </div>

                {/* The actual input remains for fine-tuning time */}
                <input
                  type="datetime-local"
                  value={eventAt}
                  onChange={(e) => setEventAt(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-b-2 border-slate-200 focus:border-slate-950 text-slate-900 font-bold outline-none transition-all text-sm tabular-nums"
                />
              </div>

            <button
              type="submit"
              disabled={loading || !value}
              className={`w-full p-5 rounded-sm font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-[0.98] ${
                success 
                ? 'bg-green-600 text-white shadow-green-100' 
                : 'bg-slate-950 text-white shadow-slate-200 disabled:opacity-30'
              }`}
            >
              {loading ? 'Executing...' : success ? 'Commit Success' : 'Confirm Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}