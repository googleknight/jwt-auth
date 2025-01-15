import { getAllUsers } from '../../src/services';
import { getUsersWithoutPassword } from '../../src/repositories';
import { User, Roles } from '../../src/types';

jest.mock('../../src/repositories'); // Mock the repositories module

describe('getAllUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of users without passwords', () => {
    const mockUsers: User[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        role: Roles.ADMIN,
        email: 'john.doe@example.com',
        password: 'password123',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'Female',
        role: Roles.USER,
        email: 'jane.doe@example.com',
        password: 'password456',
      },
    ];

    (getUsersWithoutPassword as jest.Mock).mockReturnValue(
      mockUsers.map(({ password, ...rest }) => rest)
    );

    const users = getAllUsers();

    expect(users).toEqual([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        role: Roles.ADMIN,
        email: 'john.doe@example.com',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'Female',
        role: Roles.USER,
        email: 'jane.doe@example.com',
      },
    ]);
    expect(getUsersWithoutPassword).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if there are no users', () => {
    (getUsersWithoutPassword as jest.Mock).mockReturnValue([]);

    const users = getAllUsers();

    expect(users).toEqual([]);
    expect(getUsersWithoutPassword).toHaveBeenCalledTimes(1);
  });
});
