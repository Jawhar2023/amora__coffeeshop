import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onCancel} />
      <div className="animate-pop relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-elevated">
        <p className="text-base font-bold text-ink-900">{title}</p>
        <p className="mt-1.5 text-sm text-ink-600">{message}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="ghost" full onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} full onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
