import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { AuthRepository } from '@/services/storage/authStorage';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/FormField';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (AuthRepository.login(email, password)) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <Lock size={20} />
        </div>
        <h1 className="mt-4 text-center text-xl font-extrabold text-ink-900">Admin Console</h1>
        <p className="mt-1 text-center text-xs text-ink-400">Demo authentication — not for production use.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <Button type="submit" full size="lg">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}
