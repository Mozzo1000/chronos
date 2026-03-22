import { useState, useEffect } from 'preact/hooks';
import pb from '../lib/pocketbase';
import { TRACKING_CONFIG } from '../config';
import IconRenderer from './IconRenderer';
import { ChevronDown, ChevronUp } from 'lucide-preact';

export default function LogEntry({ isOpen, onClose, initialKey }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKey, setSelectedKey] = useState(TRACKING_CONFIG[0].key);
  const [value, setValue] = useState('');
  const [eventAt, setEventAt] = useState(new Date().toISOString().slice(0, 16));

  // Determine which metrics to show initially (e.g., top 4 or whatever fits well)
  const visibleMetrics = isExpanded ? TRACKING_CONFIG : TRACKING_CONFIG.slice(0, 4);

  useEffect(() => {
    if (isOpen && initialKey) {
      setSelectedKey(initialKey);
      // Auto-expand if the initial key isn't in the top 4
      if (!TRACKING_CONFIG.slice(0, 4).find(m => m.key === initialKey)) {
        setIsExpanded(true);
      }
    } else if (isOpen) {
      setSelectedKey(TRACKING_CONFIG[0].key);
      setIsExpanded(false);
    }
  }, [isOpen, initialKey]);

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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full h-[92%] md:h-auto md:max-w-3xl bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-y-auto transition-all duration-300">
        
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 border-b border-slate-100 flex justify-between items-center z-10">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 px-2 text-sm font-medium">
            Cancel
          </button>
          <h2 className="font-bold text-slate-900 tracking-tight text-center">New Entry</h2>
          <div className="w-12"></div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            
            {/* Metric Badge Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">Select Metric</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleMetrics.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedKey(item.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md border-2 transition-all duration-200 ${
                      selectedKey === item.key 
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md scale-105' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <IconRenderer 
                      name={item.icon} 
                      size={16} 
                      strokeWidth={2.5} 
                      className={selectedKey === item.key ? 'text-white' : 'text-slate-400'}
                    />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-md border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-400 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span className="text-sm font-medium">{isExpanded ? 'Show Less' : 'More...'}</span>
                </button>
              </div>
            </div>

            {/* Value Input Area */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 block mb-4">
                Record {TRACKING_CONFIG.find(c => c.key === selectedKey).label}
              </label>
              
              {TRACKING_CONFIG.find(c => c.key === selectedKey).type === 'select' ? (
                <div className="grid grid-cols-2 gap-3">
                  {TRACKING_CONFIG.find(c => c.key === selectedKey).options.map(opt => (
                    <button
                      type="button"
                      onClick={() => setValue(opt)}
                      className={`p-4 rounded-2xl border-2 transition-all font-bold ${
                        value === opt 
                        ? 'border-slate-900 bg-white text-slate-900 shadow-sm' 
                        : 'border-transparent bg-slate-200/50 text-slate-500'
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
                    className="w-full bg-transparent border-b-2 border-slate-200 focus:border-slate-900 text-4xl font-black outline-none transition-colors py-2 text-slate-900"
                    placeholder="00"
                    required
                  />
                  <span className="absolute right-0 bottom-3 text-slate-300 font-bold uppercase text-xs">
                    {TRACKING_CONFIG.find(c => c.key === selectedKey).category}
                  </span>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className="px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timestamp</label>
              <input
                type="datetime-local"
                value={eventAt}
                onChange={(e) => setEventAt(e.target.value)}
                className="w-full mt-2 p-3 bg-white border border-slate-100 rounded-xl text-slate-500 text-sm outline-none focus:ring-1 focus:ring-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !value}
              className={`w-full p-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-[0.97] ${
                success 
                ? 'bg-green-500 text-white shadow-green-200' 
                : 'bg-slate-900 text-white shadow-slate-200 disabled:opacity-30'
              }`}
            >
              {loading ? 'Processing...' : success ? 'Successfully Logged' : 'Finish Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}