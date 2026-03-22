import { useState, useEffect } from 'preact/hooks';
import pb from '../lib/pocketbase';
import { TRACKING_CONFIG } from '../config';
import IconRenderer from './IconRenderer';
import { Trash2, Clock, Zap } from 'lucide-preact';

export default function HistoryList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      // Fetch last 50 records, sorted by event_at descending
      const resultList = await pb.collection('logs').getList(1, 50, {
        sort: '-event_at',
      });
      setRecords(resultList.items);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    
    // Optional: Real-time updates
    return pb.collection('logs').subscribe('*', () => {
      fetchRecords();
    });
  }, []);

  const deleteRecord = async (id) => {
    if (confirm("Delete this entry?")) {
      await pb.collection('logs').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  // Grouping logic: Groups records by "YYYY-MM-DD"
  const grouped = records.reduce((groups, record) => {
    const date = new Date(record.event_at).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(record);
    return groups;
  }, {});

  if (loading) return <div className="p-10 text-center text-slate-400 animate-pulse">Loading Timeline...</div>;

  return (
    <div className="max-w-2xl mx-auto pb-32">
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center mt-20 text-slate-400">
          <Zap className="mx-auto mb-4 opacity-20" size={48} />
          <p className="font-medium">No data points found.</p>
          <p className="text-xs">Start logging via the FAB below.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <section key={date} className="mb-8">
            {/* Sticky Date Header */}
            <header className="sticky top-0 bg-[#fafafa]/80 backdrop-blur-md z-20 py-4 px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {date === new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }) ? 'Today' : date}
              </h3>
            </header>

            <div className="space-y-1">
              {items.map((log) => {
                const config = TRACKING_CONFIG.find(c => c.key === log.key);
                return (
                  <div 
                    key={log.id} 
                    className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center text-slate-600">
                        <IconRenderer name={config?.icon || 'Activity'} size={18} />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-900">{log.value}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {config?.label || log.key}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Clock size={10} />
                          {new Date(log.event_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {log.source === 'auto' && <span className="ml-1 text-blue-500">· Auto</span>}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteRecord(log.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}