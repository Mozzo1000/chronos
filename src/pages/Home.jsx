import { useState } from 'preact/hooks';
import LogEntry from '../components/LogEntry';
import FAB from '../components/FAB';
import HistoryList from '../components/HistoryList';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialKey, setInitialKey] = useState(null);

  const openWithKey = (key = null) => {
    setInitialKey(key);
    setIsModalOpen(true);
  };

  return (
    <div className="px-6">
        <HistoryList />
      <FAB onAction={openWithKey} />
      <LogEntry isOpen={isModalOpen} initialKey={initialKey} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}