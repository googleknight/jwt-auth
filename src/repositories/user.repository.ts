import { users } from '../constants';
import { User } from '../types';

const getUsersWithoutPassword = (): Partial<User>[] => {
  return users.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ password, ...userWithoutPassword }) => userWithoutPassword
  );
};

const getUser = (userId: number): User | null => {
  return users.find((user) => user.id === userId) || null;
};

const getUserByEmail = (email: string): User | null => {
  return users.find((user) => user.email === email) ?? null;
};

export { getUsersWithoutPassword, getUserByEmail, getUser };
