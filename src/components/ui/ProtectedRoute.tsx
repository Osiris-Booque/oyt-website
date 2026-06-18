import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../../lib/constants';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.some((r) => profile.roles.includes(r))) {
    return <Navigate to="/dashboard" replace />;
  }

  if (profile && !profile.roles.includes('member')) {
    if (profile.roles.includes('admin')) {
      return <Navigate to="/admin" replace />;
    }
    if (profile.roles.includes('instructor')) {
      return <Navigate to="/instructor" replace />;
    }
  }

  return <>{children}</>;
}
