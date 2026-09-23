import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { GameRepository, QuizRepository } from '@/services/storage/gameStorage';
import { uid } from '@/services/storage/storageService';
import type { GameConfig } from '@/types';
import PageHeader from '@/components/admin/PageHeader';
import { Select, Input } from '@/components/ui/FormField';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function GamesPage() {
  const [refresh, setRefresh] = useState(0);
  const games = useMemo(() => GameRepository.getAll(), [refresh]);
  const questions = useMemo(() => QuizRepository.getAll(), [refresh]);

  const toggle = (g: GameConfig) => {
    GameRepository.update(g.id, { enabled: !g.enabled });
    setRefresh((n) => n + 1);
  };

  const changeDifficulty = (g: GameConfig, difficulty: GameConfig['difficulty']) => {
    GameRepository.update(g.id, { difficulty });
    setRefresh((n) => n + 1);
  };

  const addQuestion = () => {
    QuizRepository.save([
      ...questions,
      { id: uid('quiz'), question: 'New question?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
    ]);
    setRefresh((n) => n + 1);
  };

  const updateQuestion = (id: string, patch: Partial<(typeof questions)[number]>) => {
    QuizRepository.save(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    setRefresh((n) => n + 1);
  };

  const removeQuestion = (id: string) => {
    QuizRepository.save(questions.filter((q) => q.id !== id));
    setRefresh((n) => n + 1);
  };

  return (
    <div>
      <PageHeader title="Games" subtitle="Configure the Game Center shown while customers wait" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <div key={g.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{g.icon}</span>
              <button onClick={() => toggle(g)}>
                <Badge tone={g.enabled ? 'success' : 'neutral'}>{g.enabled ? 'Enabled' : 'Disabled'}</Badge>
              </button>
            </div>
            <p className="mt-2 text-sm font-bold text-ink-900">{g.name}</p>
            <p className="text-xs text-ink-400">{g.description}</p>
            <div className="mt-3">
              <Select value={g.difficulty} onChange={(e) => changeDifficulty(g, e.target.value as GameConfig['difficulty'])}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-base font-extrabold text-ink-900">Tunisia Quiz questions</p>
          <Button size="sm" icon={<Plus size={14} />} onClick={addQuestion}>
            Add question
          </Button>
        </div>
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100">
              <div className="flex items-start gap-2">
                <Input
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                  className="flex-1"
                />
                <button onClick={() => removeQuestion(q.id)} className="mt-2.5 text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={q.correctIndex === i}
                      onChange={() => updateQuestion(q.id, { correctIndex: i })}
                    />
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const next = [...q.options];
                        next[i] = e.target.value;
                        updateQuestion(q.id, { options: next });
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
