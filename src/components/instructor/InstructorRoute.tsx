import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function InstructorRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingSpinner className="py-20" />;
  if (!profile || !profile.roles.includes('instructor')) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
