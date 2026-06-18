import type { UserRole } from '../../lib/constants';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  role: UserRole;
  roles: UserRole[];
  headline: string | null;
}
