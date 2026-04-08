export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type AuthResponse = {
  message: string;
  user?: User;
};