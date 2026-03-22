import { useState } from 'preact/hooks';
import { useAuth } from '../hooks/useAuth';
import Login from '../components/Login';
import LogEntry from '../components/LogEntry';
import FAB from '../components/FAB';
import HistoryList from '../components/HistoryList';
import Header from '../components/Header';

export default function Home() {
  const { isValid, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialKey, setInitialKey] = useState(null);

  const openWithKey = (key = null) => {
    setInitialKey(key);
    setIsModalOpen(true);
  };
  if (!isValid) return <Login />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="px-6">
        <HistoryList />
      </main>

      <FAB onAction={openWithKey} />
      <LogEntry isOpen={isModalOpen} initialKey={initialKey} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}