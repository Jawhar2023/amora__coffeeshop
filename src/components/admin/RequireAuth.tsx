import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthRepository } from '@/services/storage/authStorage';

export default function RequireAuth({ children }: { children: ReactNode }) {
  if (!AuthRepository.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
