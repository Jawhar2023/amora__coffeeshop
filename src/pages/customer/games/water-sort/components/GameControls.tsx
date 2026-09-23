import { Undo2, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface GameControlsProps {
  canUndo: boolean;
  soundEnabled: boolean;
  onUndo: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
}

function ControlButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all active:scale-90 disabled:opacity-30 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}

export default function GameControls({ canUndo, soundEnabled, onUndo, onRestart, onToggleSound }: GameControlsProps) {
  return (
    <div className="flex items-center gap-2.5">
      <ControlButton onClick={onUndo} disabled={!canUndo} label="Undo last move">
        <Undo2 size={18} />
      </ControlButton>
      <ControlButton onClick={onRestart} label="Restart level">
        <RotateCcw size={18} />
      </ControlButton>
      <ControlButton onClick={onToggleSound} label={soundEnabled ? 'Mute sound' : 'Unmute sound'}>
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </ControlButton>
    </div>
  );
}
