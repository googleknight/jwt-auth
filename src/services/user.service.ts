import { getUsersWithoutPassword } from '../repositories';
import { User } from '../types';
export const getAllUsers = (): Partial<User>[] => {
  return getUsersWithoutPassword();
};
