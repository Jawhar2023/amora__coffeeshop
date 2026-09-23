import { Star } from 'lucide-react';

export default function StarRating({ stars, size = 28 }: { stars: 1 | 2 | 3; size?: number }) {
  return (
    <div className="flex items-center justify-center gap-2" role="img" aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          size={size}
          className={`animate-pop ${n <= stars ? 'fill-amber-400 text-amber-400' : 'fill-white/10 text-white/20'}`}
          style={{ animationDelay: `${n * 90}ms` }}
        />
      ))}
    </div>
  );
}
