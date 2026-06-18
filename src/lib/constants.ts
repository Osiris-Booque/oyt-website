export const ROLES = {
  MEMBER: 'member',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: UserRole[] = ['member', 'instructor', 'admin'];

export const ROLE_LABELS: Record<string, string> = {
  member: 'Member',
  instructor: 'Instructor',
  admin: 'Admin',
};

export const ROLE_COLORS: Record<string, string> = {
  member: 'bg-stone-100 text-slate-600',
  instructor: 'bg-amber-100 text-amber-700',
  admin: 'bg-rose-100 text-rose-700',
};

export const ROLE_PRIORITY: Record<UserRole, number> = {
  member: 1,
  instructor: 2,
  admin: 3,
};

export function highestRole(roles: string[]): UserRole {
  if (!roles.length) return 'member';
  return roles.reduce((a, b) =>
    (ROLE_PRIORITY[a as UserRole] ?? 0) >= (ROLE_PRIORITY[b as UserRole] ?? 0) ? a : b
  ) as UserRole;
}

export const PROGRAM_CATEGORIES = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'breathwork', label: 'Breathwork' },
  { value: 'therapy', label: 'Therapy' },
  { value: 'training', label: 'Training' },
  { value: 'wellness', label: 'Wellness' },
] as const;

export const POST_CATEGORIES = [
  { value: 'general', label: 'General Discussion' },
  { value: 'question', label: 'Question' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'resource', label: 'Resource Share' },
] as const;

export const REACTION_TYPES = [
  { value: 'like', label: 'Like', emoji: '👍' },
  { value: 'helpful', label: 'Helpful', emoji: '✨' },
  { value: 'inspiring', label: 'Inspiring', emoji: '💫' },
  { value: 'insightful', label: 'Insightful', emoji: '💡' },
] as const;
