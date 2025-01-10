import { Request, Response } from 'express';
import { getAllUsers } from '../services';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await getAllUsers();
  res.json(users);
};
