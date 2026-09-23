import { useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

type Phase = 'idle' | 'waiting' | 'ready' | 'result' | 'tooSoon';

export default function ReactionGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('idle');
  const [reactionMs, setReactionMs] = useState(0);
  const startTime = useRef(0);
  const timeoutId = useRef<number>(0);
  const best = GameScoreRepository.getBestReactionMs();

  const startRound = () => {
    setPhase('waiting');
    const delay = 1200 + Math.random() * 2500;
    timeoutId.current = window.setTimeout(() => {
      startTime.current = performance.now();
      setPhase('ready');
    }, delay);
  };

  const handleTap = () => {
    if (phase === 'waiting') {
      window.clearTimeout(timeoutId.current);
      setPhase('tooSoon');
      return;
    }
    if (phase === 'ready') {
      const ms = Math.round(performance.now() - startTime.current);
      setReactionMs(ms);
      GameScoreRepository.record('reaction', ms);
      setPhase('result');
    }
  };

  if (phase === 'result') {
    return (
      <GameOverScreen
        score={reactionMs}
        scoreLabel={`${t('yourReaction')} (ms) · ${t('best')}: ${GameScoreRepository.getBestReactionMs()} ms`}
        onRestart={startRound}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader title="⚡ Reaction Test" />

      {phase === 'idle' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">⚡</span>
          <p className="text-sm text-ink-500">
            {t('best')}: {best > 0 ? `${best} ms` : '—'}
          </p>
          <Button size="lg" onClick={startRound}>
            {t('startGame')}
          </Button>
        </div>
      )}

      {(phase === 'waiting' || phase === 'ready') && (
        <button
          onClick={handleTap}
          className={`flex flex-1 flex-col items-center justify-center gap-3 transition-colors ${
            phase === 'ready' ? 'bg-emerald-500' : 'bg-ink-800'
          }`}
        >
          <span className="text-3xl font-extrabold text-white">
            {phase === 'ready' ? t('tapNow') : t('getReady')}
          </span>
        </button>
      )}

      {phase === 'tooSoon' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-5xl">😅</span>
          <p className="text-base font-bold text-ink-900">Too soon! Wait for green.</p>
          <Button size="lg" onClick={startRound}>
            {t('playAgain')}
          </Button>
        </div>
      )}
    </div>
  );
}
