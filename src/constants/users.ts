import { Roles, User } from '../types';

export const users: User[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    gender: 'female',
    email: 'alice@example.com',
    password: '$2b$12$4gpVvWTBjgOoUbgNOL3QaeFW/OMG/RYYDVOeSWQ6fz8HZ2iTJJthO', //'Happy$Tiger88!'
    role: Roles.ADMIN,
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Johnson',
    gender: 'male',
    email: 'bob@example.com',
    password: '$2b$12$MyXh9MhVCko.Lh/VFfFII.4I5MPS5ZRkubwaGMliCrB9KH.FVvfx2', //'Starry#Moon45'
    role: Roles.ADMIN,
  },
  {
    id: 3,
    firstName: 'Charlie',
    lastName: 'Davis',
    gender: 'male',
    email: 'charlie@example.com',
    password: '$2b$12$zac26Ki/L2t.RiNk3C5zre4m1UAhXx8wfFqG1XwZfmkN/fJp0Q5ge', //'Green@Panda72'
    role: Roles.USER,
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Williams',
    gender: 'male',
    email: 'david@example.com',
    password: '$2b$12$rkJD75QeaW6fe.UGbkTEtuC0QeiIVyKWQqTBDaYtOfmGea51IJ4Ei', //'Sunny&River19',
    role: Roles.DEV,
  },
];
