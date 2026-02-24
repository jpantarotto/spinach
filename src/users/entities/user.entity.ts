export type GlobalRole = 'USER' | 'SUPERADMIN';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  globalRole: GlobalRole;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'password'>;
