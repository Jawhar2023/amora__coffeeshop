import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameStatus, LiquidColor, Tube } from '../types';
import { canPour, cloneTubes, isSolved, pour } from '../engine/gameLogic';
import { generateLevel, getTargetMoves } from '../engine/levelGenerator';
import { calculateStars } from '../engine/scoring';
import { WaterSortProgressRepository } from '../storage';
import { playSfx } from '../sound';
import { GameScoreRepository } from '@/services/storage/gameStorage';

export interface PendingAnim {
  fromId: string;
  toId: string;
  color: LiquidColor;
  amount: number;
}

const ANIM_MS = 520;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useWaterSortGame() {
  const progress = useMemo(() => WaterSortProgressRepository.get(), []);

  const [status, setStatus] = useState<GameStatus>('idle');
  const [level, setLevel] = useState(progress.currentLevel);
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [initialTubes, setInitialTubes] = useState<Tube[]>([]);
  const [history, setHistory] = useState<Tube[][]>([]);
  const [selectedTube, setSelectedTube] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [stars, setStars] = useState<1 | 2 | 3>(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingAnim, setPendingAnim] = useState<PendingAnim | null>(null);
  const [shakeTubeId, setShakeTubeId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(progress.soundEnabled);
  const [targetMoves, setTargetMoves] = useState(0);

  const animTimeout = useRef<number | null>(null);
  const shakeTimeout = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (animTimeout.current) window.clearTimeout(animTimeout.current);
      if (shakeTimeout.current) window.clearTimeout(shakeTimeout.current);
    },
    []
  );

  const bestMoves = WaterSortProgressRepository.get().bestMoves[level];

  const startLevel = useCallback((lv: number) => {
    const puzzle = generateLevel(lv);
    setLevel(lv);
    setTubes(puzzle);
    setInitialTubes(cloneTubes(puzzle));
    setHistory([]);
    setSelectedTube(null);
    setMoves(0);
    setPendingAnim(null);
    setIsAnimating(false);
    setStatus('playing');
    setTargetMoves(getTargetMoves(lv, puzzle));
    WaterSortProgressRepository.setCurrentLevel(lv);
  }, []);

  const commitPour = useCallback(
    (fromId: string, toId: string) => {
      const result = pour(tubes, fromId, toId);
      if (result.amount <= 0 || !result.color) return;

      const reducedMotion = prefersReducedMotion();
      setHistory((h) => [...h, cloneTubes(tubes)]);
      setSelectedTube(null);
      playSfx('pour', soundEnabled);

      const finish = () => {
        setTubes(result.tubes);
        setMoves((m) => m + 1);
        setIsAnimating(false);
        setPendingAnim(null);

        if (isSolved(result.tubes)) {
          const finalMoves = moves + 1;
          const earnedStars = calculateStars(finalMoves, targetMoves);
          setStars(earnedStars);
          GameScoreRepository.record('water-sort', level);
          WaterSortProgressRepository.recordBestMoves(level, finalMoves);
          playSfx('win', soundEnabled);
          setStatus('won');
        }
      };

      if (reducedMotion) {
        finish();
        return;
      }

      setIsAnimating(true);
      setPendingAnim({ fromId, toId, color: result.color, amount: result.amount });
      animTimeout.current = window.setTimeout(finish, ANIM_MS);
    },
    [tubes, moves, level, targetMoves, soundEnabled]
  );

  const triggerShake = useCallback((tubeId: string) => {
    playSfx('invalid', soundEnabled);
    setShakeTubeId(tubeId);
    if (shakeTimeout.current) window.clearTimeout(shakeTimeout.current);
    shakeTimeout.current = window.setTimeout(() => setShakeTubeId(null), 360);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled]);

  const selectTube = useCallback(
    (tubeId: string) => {
      if (status !== 'playing' || isAnimating) return;

      const tube = tubes.find((t) => t.id === tubeId);
      if (!tube) return;

      if (selectedTube === null) {
        if (tube.layers.length === 0) return;
        setSelectedTube(tubeId);
        playSfx('select', soundEnabled);
        return;
      }

      if (selectedTube === tubeId) {
        setSelectedTube(null);
        return;
      }

      const source = tubes.find((t) => t.id === selectedTube);
      if (!source) return;

      if (canPour(source, tube) > 0) {
        commitPour(selectedTube, tubeId);
      } else {
        triggerShake(tubeId);
        setSelectedTube(tube.layers.length > 0 ? tubeId : null);
      }
    },
    [status, isAnimating, tubes, selectedTube, commitPour, triggerShake, soundEnabled]
  );

  const undo = useCallback(() => {
    if (isAnimating || history.length === 0 || status !== 'playing') return;
    const prev = history[history.length - 1];
    setTubes(prev);
    setHistory((h) => h.slice(0, -1));
    setMoves((m) => Math.max(0, m - 1));
    setSelectedTube(null);
    playSfx('click', soundEnabled);
  }, [isAnimating, history, status, soundEnabled]);

  const restart = useCallback(() => {
    if (isAnimating) return;
    setTubes(cloneTubes(initialTubes));
    setHistory([]);
    setSelectedTube(null);
    setMoves(0);
    setStatus('playing');
    playSfx('click', soundEnabled);
  }, [isAnimating, initialTubes, soundEnabled]);

  const nextLevel = useCallback(() => {
    startLevel(level + 1);
  }, [level, startLevel]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      WaterSortProgressRepository.setSoundEnabled(next);
      return next;
    });
  }, []);

  return {
    tubes,
    selectedTube,
    moves,
    level,
    status,
    stars,
    isAnimating,
    pendingAnim,
    shakeTubeId,
    soundEnabled,
    bestMoves,
    targetMoves,
    canUndo: history.length > 0 && !isAnimating && status === 'playing',
    startLevel,
    selectTube,
    undo,
    restart,
    nextLevel,
    toggleSound,
  };
}
