import { useState } from 'preact/hooks';
import pb from '../lib/pocketbase';

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
      // Authenticating as a User (default collection)
      await pb.collection('users').authWithPassword(email, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chronos</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your life ledger</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="name@oberon.lan"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium text-center bg-red-50 p-2 rounded-lg italic">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-medium transition-all transform active:scale-95 shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}