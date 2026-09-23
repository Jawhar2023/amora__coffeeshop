import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-sheet-up relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-elevated sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/95 px-5 py-3.5 backdrop-blur">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-ink-200 sm:hidden" />
          {title && <span className="text-base font-bold text-ink-900">{title}</span>}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-3 rounded-full p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-800"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
