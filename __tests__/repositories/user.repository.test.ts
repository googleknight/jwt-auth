import { users } from '../../src/constants';
import {
  getUsersWithoutPassword,
  getUserByEmail,
  getUser,
} from '../../src/repositories';

describe('user.repository', () => {
  describe('getUsersWithoutPassword', () => {
    it('should return a list of users without the password field', () => {
      const usersWithoutPassword = getUsersWithoutPassword();

      expect(usersWithoutPassword).toHaveLength(users.length);
      usersWithoutPassword.forEach((user) => {
        expect(user).not.toHaveProperty('password');
        expect(Object.keys(user).sort()).toEqual(
          ['email', 'id', 'firstName', 'lastName', 'gender', 'role'].sort()
        ); // Check for other expected fields
      });
    });
  });

  describe('getUser', () => {
    it('should return the correct user if found', () => {
      const existingUserId = users[0].id;
      const user = getUser(existingUserId);
      expect(user).toEqual(users[0]);
    });

    it('should return null if user is not found', () => {
      const nonExistingUserId = 999;
      const user = getUser(nonExistingUserId);
      expect(user).toBeNull();
    });

    it('should return null if userId is undefined', () => {
      const user = getUser(undefined as any); // Simulating undefined scenario
      expect(user).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return the correct user if found', () => {
      const existingUserEmail = users[1].email;
      const user = getUserByEmail(existingUserEmail);
      expect(user).toEqual(users[1]);
    });

    it('should return null if user is not found', () => {
      const nonExistingUserEmail = 'nonexisting@example.com';
      const user = getUserByEmail(nonExistingUserEmail);
      expect(user).toBeNull();
    });

    it('should return null if email is undefined', () => {
      const user = getUserByEmail(undefined as any); // Simulating undefined scenario
      expect(user).toBeNull();
    });

    it('should be case-sensitive', () => {
      const existingUserEmail = users[1].email;
      const user = getUserByEmail(existingUserEmail.toUpperCase());
      expect(user).toBeNull(); // Expect null because the search is case-sensitive
    });
  });
});
