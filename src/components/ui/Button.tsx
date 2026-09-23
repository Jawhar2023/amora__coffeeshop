import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  full?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800',
  outline: 'border border-brand-600 text-brand-600 hover:bg-brand-50',
  ghost: 'text-ink-800 hover:bg-ink-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  full,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${full ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
