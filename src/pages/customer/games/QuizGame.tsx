import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository, QuizRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

export default function QuizGame() {
  const { t, language } = useLanguage();
  const questions = useMemo(() => QuizRepository.getAll(), []);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const best = GameScoreRepository.getBest('quiz');

  const start = () => {
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setPhase('playing');
  };

  const question = questions[index];
  const questionText = question
    ? (language === 'fr' ? question.questionFr : language === 'ar' ? question.questionAr : question.question) ?? question.question
    : '';
  const optionTexts = question
    ? ((language === 'fr' ? question.optionsFr : language === 'ar' ? question.optionsAr : question.options) ?? question.options)
    : [];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === question.correctIndex;
    window.setTimeout(() => {
      const nextCorrect = correct + (isCorrect ? 1 : 0);
      setCorrect(nextCorrect);
      if (index + 1 >= questions.length) {
        GameScoreRepository.record('quiz', nextCorrect);
        setPhase('over');
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 600);
  };

  if (phase === 'over') {
    return (
      <GameOverScreen
        score={correct}
        scoreLabel={`${t('score')} / ${questions.length}`}
        onRestart={start}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader
        title="🇹🇳 Tunisia Quiz"
        right={
          phase === 'playing' ? (
            <span className="text-xs font-bold text-ink-500">
              {index + 1} / {questions.length}
            </span>
          ) : undefined
        }
      />

      {phase === 'idle' || questions.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🇹🇳</span>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best > 0 ? `${best} / ${questions.length}` : '—'}
          </p>
          <Button size="lg" onClick={start} disabled={questions.length === 0}>
            {t('startGame')}
          </Button>
        </div>
      ) : (
        <div className="flex-1 px-5 pt-4">
          <p className="text-lg font-bold text-ink-900">{questionText}</p>
          <div className="mt-5 space-y-2.5">
            {optionTexts.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correctIndex;
              let style = 'border-ink-200 bg-white';
              if (selected !== null) {
                if (isCorrect) style = 'border-emerald-500 bg-emerald-50';
                else if (isSelected) style = 'border-red-500 bg-red-50';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold text-ink-800 transition-colors ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
