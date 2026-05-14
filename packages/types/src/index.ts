// @agri-packages/types
export type UserRole = 'ADMIN' | 'FARMER' | 'EXPERT' | 'GUEST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
