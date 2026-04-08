export interface AuthUser {
  userId: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}