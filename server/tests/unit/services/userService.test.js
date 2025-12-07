// Import Jest globals for ESM
import { jest, describe, test, expect, beforeAll, beforeEach } from '@jest/globals';

// Mock modules for ESM - when ANYONE imports taskModel.js or db.js later, use THIS mocked version instead.
jest.unstable_mockModule("../../../src/models/userModel.js", () => ({
  UserModel: { login: jest.fn(), signup: jest.fn() }
}));

jest.unstable_mockModule("../../../src/config/db.js", () => ({
  default: {}
}));

// Use dynamic imports after mocks
let UserService, ValidationError, UserModel;

beforeAll(async () => {
  const userServiceModule = await import("../../../src/services/userService.js");
  const errorsModule = await import("../../../src/utils/errors.js");
  const userModelModule = await import("../../../src/models/userModel.js");
  
  UserService = userServiceModule.UserService;
  ValidationError = errorsModule.ValidationError;
  UserModel = userModelModule.UserModel;
});

describe("UserService.login - validation error", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  test("throws validation error when email is invalid", async () => {
    const payload = {email: "notavalidemail", password: "12341234"};
    
    await expect(UserService.login(payload)).rejects.toBeInstanceOf(ValidationError);

    expect(UserModel.login).not.toHaveBeenCalled();
  });
});