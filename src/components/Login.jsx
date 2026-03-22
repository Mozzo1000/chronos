import { useState } from 'preact/hooks';
import pb from '../lib/pocketbase';
import { Lock, User, AlertCircle } from 'lucide-preact';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await pb.collection('users').authWithPassword(email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] p-0 md:p-6">
      
      {/* Container: 
          Mobile: Full screen (h-screen), no borders.
          Desktop: Centered card (h-auto), bordered, subtle shadow.
      */}
      <div className="w-full h-screen md:h-auto md:max-w-md bg-white md:border md:border-slate-100 md:rounded-sm md:shadow-2xl flex flex-col justify-center px-10 py-12">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Chronos
          </h1>
          <p className="text-slate-400 text-xs font-medium mt-3 tracking-wide">
            Sign in to your life ledger
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onInput={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 border-b-2 border-slate-100 focus:border-slate-900 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                placeholder="name@example.com"
                required
              />
              <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border-b-2 border-slate-100 focus:border-slate-900 text-slate-900 font-bold outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-4 border-l-4 border-red-600 animate-in fade-in duration-300">
               <AlertCircle size={14} />
               {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 px-4 font-black text-xs uppercase tracking-[0.3em] transition-all transform active:scale-[0.98] shadow-lg ${
              loading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}