import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.kind];
          return (
            <div
              key={toast.id}
              className="animate-toast-in flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-medium text-white shadow-elevated"
            >
              <Icon
                size={16}
                className={
                  toast.kind === 'success'
                    ? 'text-emerald-400'
                    : toast.kind === 'error'
                      ? 'text-red-400'
                      : 'text-brand-300'
                }
              />
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
