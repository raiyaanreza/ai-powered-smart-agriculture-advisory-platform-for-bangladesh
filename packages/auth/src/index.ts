// @agri-packages/auth
export interface AuthUser {
  id: string;
  role: 'admin' | 'farmer' | 'user';
  email: string;
}

export function hasRole(user: AuthUser | null | undefined, allowedRoles: ('admin' | 'farmer' | 'user')[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function isAdmin(user: AuthUser | null | undefined): boolean {
  return hasRole(user, ['admin']);
}

export function isFarmer(user: AuthUser | null | undefined): boolean {
  return hasRole(user, ['farmer', 'admin']);
}

export function parseJwt(token: string): AuthUser | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as AuthUser;
  } catch (e) {
    return null;
  }
}
