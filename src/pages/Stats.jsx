import { useState, useEffect } from 'preact/hooks';
import pb from '../lib/pocketbase';
import { TRACKING_CONFIG } from '../config';
import IconRenderer from '../components/IconRenderer';
import { Calendar as CalendarIcon, TrendingUp, Activity } from 'lucide-preact';

export default function Stats() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [selectedDate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch all records for the selected date
      // PocketBase filter: event_at >= "YYYY-MM-DD 00:00:00" && event_at <= "YYYY-MM-DD 23:59:59"
      const filter = `event_at >= "${selectedDate} 00:00:00" && event_at <= "${selectedDate} 23:59:59"`;
      const records = await pb.collection('logs').getFullList({ filter });

      // Aggregate data based on TRACKING_CONFIG
      const summary = TRACKING_CONFIG.map(config => {
        const logs = records.filter(r => r.key === config.key);
        
        let displayValue = '0';
        if (logs.length > 0) {
          if (config.type === 'number') {
            // Sum numbers (e.g., Steps) or take the latest (e.g., Weight)
            const sum = logs.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
            displayValue = config.key === 'weight' ? logs[0].value : sum; 
          } else {
            // For 'select' types, show the count or the most recent entry
            displayValue = logs.length;
          }
        }

        return { ...config, count: logs.length, value: displayValue };
      });

      setStats(summary);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 mt-6 px-6">
      
      {/* Date Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 bg-white p-4 border border-slate-100 rounded-sm shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 text-white rounded-sm">
            <CalendarIcon size={18} />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Temporal Scope</h2>
            <p className="text-sm font-bold text-slate-900">Daily Performance Review</p>
          </div>
        </div>

        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-sm font-mono font-bold text-slate-700 outline-none focus:border-slate-950 transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map(stat => (
            <div key={stat.key} className="bg-white border border-slate-100 p-6 rounded-sm shadow-sm hover:border-slate-300 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-slate-400 group-hover:text-slate-950 transition-colors">
                  <IconRenderer name={stat.icon} size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {stat.category}
                </span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-950 tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {stat.type === 'number' && stat.key !== 'weight' ? 'Total' : 'Latest'}
                </span>
              </div>
              
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                {stat.label}
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                <TrendingUp size={12} className="text-green-500" />
                <span className="text-[10px] font-bold text-slate-400">
                  {stat.count} entries recorded today
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && stats.every(s => s.count === 0) && (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-sm">
          <Activity className="mx-auto mb-4 text-slate-200" size={40} />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No Data Logged for this Cycle</p>
        </div>
      )}
    </div>
  );
}