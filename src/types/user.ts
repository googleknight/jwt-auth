export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  DEV = 'dev',
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  role: Roles;
  email: string;
  password: string;
}
