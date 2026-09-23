import { useRef, useState } from 'react';
import { MessageCircleQuestion, Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

const ROUNDS = 6;

interface Prompt {
  en: string;
  fr: string;
  ar: string;
}

const TRUTHS: Prompt[] = [
  { en: "What's your favorite dish on this menu?", fr: 'Quel est ton plat préféré sur ce menu ?', ar: 'ما هو طبقك المفضل في هذه القائمة؟' },
  {
    en: "What's the most adventurous food you've ever eaten?",
    fr: 'Quel est le plat le plus audacieux que tu aies jamais mangé ?',
    ar: 'ما هو أغرب طعام تناولته في حياتك؟',
  },
  {
    en: 'If you could only eat one meal for the rest of your life, what would it be?',
    fr: 'Si tu ne pouvais manger qu\'un seul plat pour le reste de ta vie, lequel choisirais-tu ?',
    ar: 'لو كان عليك أن تأكل وجبة واحدة فقط لبقية حياتك، ماذا ستختار؟',
  },
  {
    en: "What's a food you refuse to eat, no matter what?",
    fr: 'Quel aliment refuses-tu de manger, quoi qu\'il arrive ?',
    ar: 'ما هو الطعام الذي ترفض أكله مهما حدث؟',
  },
  { en: "Who's the best cook in your family?", fr: 'Qui est le meilleur cuisinier de ta famille ?', ar: 'من هو أفضل طاهٍ في عائلتك؟' },
  { en: "What's your go-to comfort food?", fr: 'Quel est ton plat réconfortant préféré ?', ar: 'ما هو طعامك المفضل عندما تشعر بالحاجة للراحة؟' },
  {
    en: 'Have you ever sent food back at a restaurant? Why?',
    fr: 'As-tu déjà renvoyé un plat au restaurant ? Pourquoi ?',
    ar: 'هل سبق أن أعدت طبقًا في مطعم؟ لماذا؟',
  },
  {
    en: "What's the weirdest food combination you actually enjoy?",
    fr: "Quelle est la combinaison d'aliments la plus étrange que tu apprécies vraiment ?",
    ar: 'ما هو أغرب مزيج طعام تستمتع به فعلاً؟',
  },
  {
    en: "What's your idea of a perfect meal with friends?",
    fr: "C'est quoi, pour toi, le repas parfait entre amis ?",
    ar: 'ما هي فكرتك عن الوجبة المثالية مع الأصدقاء؟',
  },
  {
    en: "What's a recipe you've always wanted to learn?",
    fr: 'Quelle recette as-tu toujours voulu apprendre ?',
    ar: 'ما هي الوصفة التي طالما رغبت في تعلّمها؟',
  },
  { en: 'Sweet or savory — and why?', fr: 'Sucré ou salé — et pourquoi ?', ar: 'حلو أم مالح — ولماذا؟' },
  {
    en: "What's the best meal you've had this year?",
    fr: 'Quel a été ton meilleur repas cette année ?',
    ar: 'ما هي أفضل وجبة تناولتها هذا العام؟',
  },
  {
    en: "What's a dish you make that always impresses people?",
    fr: 'Quel plat cuisines-tu qui impressionne toujours les gens ?',
    ar: 'ما هو الطبق الذي تطبخه ويُعجب الناس دائمًا؟',
  },
  {
    en: 'Would you rather cook or be cooked for?',
    fr: 'Préfères-tu cuisiner ou qu\'on cuisine pour toi ?',
    ar: 'هل تفضل أن تطبخ أم أن يُطبخ لك؟',
  },
];

const DARES: Prompt[] = [
  { en: 'Do your best waiter impression for 10 seconds.', fr: 'Imite un serveur pendant 10 secondes.', ar: 'قلّد نادلًا لمدة 10 ثوانٍ.' },
  {
    en: 'Compliment the person across from you in a fancy accent.',
    fr: 'Fais un compliment à la personne en face de toi avec un accent chic.',
    ar: 'امدح الشخص الجالس أمامك بلهجة أنيقة.',
  },
  {
    en: 'Take a selfie making your best "delicious" face.',
    fr: 'Prends un selfie en faisant ta meilleure grimace de gourmand.',
    ar: 'التقط صورة سيلفي وأنت تصنع أفضل تعبير "لذيذ" على وجهك.',
  },
  {
    en: 'Describe your meal like a fancy food critic.',
    fr: 'Décris ton plat comme un grand critique gastronomique.',
    ar: 'صف وجبتك كأنك ناقد طعام محترف.',
  },
  { en: 'Hum your favorite song for 10 seconds.', fr: 'Fredonne ta chanson préférée pendant 10 secondes.', ar: 'دندن أغنيتك المفضلة لمدة 10 ثوانٍ.' },
  {
    en: 'Guess what your neighbor ordered without asking.',
    fr: 'Devine ce qu\'a commandé ton voisin sans lui demander.',
    ar: 'خمّن ماذا طلب جارك دون أن تسأله.',
  },
  {
    en: 'Say the alphabet backwards starting from M.',
    fr: "Récite l'alphabet à l'envers en commençant par M.",
    ar: 'عد الحروف الأبجدية بالعكس بدءًا من الحرف M.',
  },
  {
    en: 'Give a one-sentence toast to good food and good company.',
    fr: 'Porte un toast en une phrase à la bonne nourriture et à la bonne compagnie.',
    ar: 'ألقِ نخبًا بجملة واحدة للطعام الجيد والرفقة الطيبة.',
  },
  {
    en: 'Do a 5-second silent dance in your seat.',
    fr: 'Fais une danse silencieuse de 5 secondes sur ta chaise.',
    ar: 'قم برقصة صامتة لمدة 5 ثوانٍ وأنت جالس.',
  },
  { en: 'Tell a joke — any joke.', fr: "Raconte une blague — n'importe laquelle.", ar: 'احكِ نكتة — أي نكتة.' },
  {
    en: 'Compliment the chef out loud (yes, really).',
    fr: 'Fais un compliment au chef à voix haute (oui, vraiment).',
    ar: 'امدح الشيف بصوت عالٍ (نعم، فعلاً).',
  },
  {
    en: 'Balance a spoon on your nose for 5 seconds.',
    fr: 'Fais tenir une cuillère en équilibre sur ton nez pendant 5 secondes.',
    ar: 'وازن ملعقة على أنفك لمدة 5 ثوانٍ.',
  },
  { en: 'Speak in a whisper for the next minute.', fr: 'Parle en chuchotant pendant la prochaine minute.', ar: 'تحدث هامسًا خلال الدقيقة القادمة.' },
  {
    en: 'Come up with a nickname for everyone at your table.',
    fr: 'Invente un surnom pour chaque personne à ta table.',
    ar: 'اخترع لقبًا لكل شخص على طاولتك.',
  },
];

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TruthOrDareGame() {
  const { t, language } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'choosing' | 'reveal' | 'over'>('idle');
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState<{ type: 'truth' | 'dare'; prompt: Prompt } | null>(null);
  const best = GameScoreRepository.getBest('truth-or-dare');

  const truthPool = useRef<Prompt[]>([]);
  const darePool = useRef<Prompt[]>([]);

  const start = () => {
    truthPool.current = shuffled(TRUTHS);
    darePool.current = shuffled(DARES);
    setRound(0);
    setPhase('choosing');
  };

  const pick = (type: 'truth' | 'dare') => {
    const pool = type === 'truth' ? truthPool.current : darePool.current;
    if (pool.length === 0) pool.push(...shuffled(type === 'truth' ? TRUTHS : DARES));
    const prompt = pool.pop()!;
    setCurrent({ type, prompt });
    setPhase('reveal');
  };

  const next = () => {
    const nextRound = round + 1;
    if (nextRound >= ROUNDS) {
      GameScoreRepository.record('truth-or-dare', ROUNDS);
      setRound(ROUNDS);
      setPhase('over');
      return;
    }
    setRound(nextRound);
    setCurrent(null);
    setPhase('choosing');
  };

  if (phase === 'over') {
    return <GameOverScreen score={ROUNDS} scoreLabel={t('roundsCompleted')} onRestart={start} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader
        title="🎭 Truth or Dare"
        right={
          phase !== 'idle' ? (
            <span className="text-xs font-bold text-ink-500">
              {t('round')} {round + 1}/{ROUNDS}
            </span>
          ) : undefined
        }
      />

      {phase === 'idle' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🎭</span>
          <p className="max-w-xs text-sm text-ink-500">{t('todIntro')}</p>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best > 0 ? `${best} ${t('roundsCompleted').toLowerCase()}` : '—'}
          </p>
          <Button size="lg" onClick={start}>
            {t('startGame')}
          </Button>
        </div>
      )}

      {phase === 'choosing' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
          <p className="text-center text-sm font-semibold text-ink-500">{t('chooseFate')}</p>
          <div className="grid w-full max-w-sm grid-cols-2 gap-4">
            <button
              onClick={() => pick('truth')}
              className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 text-white shadow-elevated transition-transform active:scale-95"
            >
              <MessageCircleQuestion size={34} />
              <span className="text-lg font-extrabold">{t('truth')}</span>
            </button>
            <button
              onClick={() => pick('dare')}
              className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-elevated transition-transform active:scale-95"
            >
              <Flame size={34} />
              <span className="text-lg font-extrabold">{t('dare')}</span>
            </button>
          </div>
        </div>
      )}

      {phase === 'reveal' && current && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <div
            className={`w-full max-w-sm rounded-3xl p-7 text-center text-white shadow-elevated ${
              current.type === 'truth'
                ? 'bg-gradient-to-br from-sky-500 to-sky-600'
                : 'bg-gradient-to-br from-brand-600 to-brand-700'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur">
              {current.type === 'truth' ? <MessageCircleQuestion size={14} /> : <Flame size={14} />}
              {current.type === 'truth' ? t('truth') : t('dare')}
            </span>
            <p className="mt-4 text-lg font-bold leading-snug">{current.prompt[language]}</p>
          </div>
          <Button size="lg" icon={<ArrowRight size={16} />} onClick={next}>
            {round + 1 >= ROUNDS ? t('finish') : t('nextRound')}
          </Button>
        </div>
      )}
    </div>
  );
}
