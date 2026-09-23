import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-ink-100 sm:flex sm:items-start sm:justify-center sm:py-6">
      <div className="relative min-h-screen w-full max-w-[480px] bg-cream-50 shadow-none sm:min-h-[calc(100vh-3rem)] sm:rounded-[2rem] sm:shadow-elevated sm:ring-1 sm:ring-ink-200/60">
        <Outlet />
      </div>
    </div>
  );
}
