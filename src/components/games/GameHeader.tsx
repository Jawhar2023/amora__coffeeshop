import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function GameHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 pb-2 pt-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/games')} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-extrabold text-ink-900">{title}</h1>
      </div>
      {right}
    </div>
  );
}
