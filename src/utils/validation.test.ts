import { validateEmail, validatePassword, validateName } from './validation';

describe('Validation functions', () => {
  describe('validateEmail', () => {
    it('should return error if email is empty', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should return error for invalid email', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid email address');
    });

    it('should pass for valid email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validatePassword', () => {
    it('should return error if password is empty', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should return error for too short password', () => {
      const result = validatePassword('Ab1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must be at least 8 characters long'
      );
    });

    it('should return error if missing letter', () => {
      const result = validatePassword('12345678!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one letter'
      );
    });

    it('should return error if missing digit', () => {
      const result = validatePassword('Abcdefgh!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one digit'
      );
    });

    it('should return error if missing special character', () => {
      const result = validatePassword('Abcdefg1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one special character'
      );
    });

    it('should pass for strong valid password', () => {
      const result = validatePassword('Abc123!@#');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateName', () => {
    it('should return error if name is empty', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('should return error if name is too short', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Name must be at least 2 characters long'
      );
    });

    it('should pass for valid name', () => {
      const result = validateName('Alice');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
