import { jest, describe, test, expect, beforeAll, beforeEach } from "@jest/globals";

// Mock jsonwebtoken
jest.unstable_mockModule("../../../src/utils/errors.js", () => ({
  AuthenticationError: class AuthenticationError extends Error {
    constructor(message, details = {}) {
      super(message);
      this.message = message;
      this.details = details;
      this.statusCode = 401;
      this.isOperational = true;
    }
  }
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn()
  }
}));

let authMiddleware;
let jwt;
let AuthenticationError;

beforeAll(async () => {
  // Set JWT_SECRET for tests
  process.env.JWT_SECRET = "test-secret-key";
  
  // Import mocked modules
  jwt = (await import("jsonwebtoken")).default;
  
  AuthenticationError = (await import("../../../src/utils/errors.js")).AuthenticationError;
  
  // Import the actual middleware
  authMiddleware = (await import("../../../src/middleware/authMiddleWare.js")).authMiddleware;
});

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();
  });

  test("reject missing authorization header", async () => {
    // Create fresh mock objects for each test
    req = {
      get: jest.fn().mockReturnValue(null),
      user: undefined
    };

    await authMiddleware(req, res, next);

    // expect authMiddleware call with no authHeader req to throw AuthenticationError
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(next.mock.calls[0][0].message).toBe("Token is invalid.");
  });

  test("reject invalid authorization header", async () => {
    // Create fresh mock objects for each test
    req = {
      get: jest.fn().mockReturnValue("bearer someToken"),
      user: undefined
    };
  
    await authMiddleware(req, res, next);

    // expect authMiddleware call with no authHeader req to throw AuthenticationError
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(next.mock.calls[0][0].message).toBe("Token is invalid.");
  });

  test("reject invalid authorization header with multiple tokens", async () => {
    // Create fresh mock objects for each test
    req = {
      get: jest.fn().mockReturnValue("bearer someToken someOtherInvalidToken"),
      user: undefined
    };
  
    await authMiddleware(req, res, next);

    // expect authMiddleware call with no authHeader req to throw AuthenticationError
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(next.mock.calls[0][0].message).toBe("Token is invalid.");
  });

  test("successfully authenticates with valid token", async () => {
    const mockUserId = 123;
    const mockToken = "valid-jwt-token";
    
    // Mock req with valid Authorization header
    req = {
      get: jest.fn().mockReturnValue(`Bearer ${mockToken}`),
      user: undefined
    };

    // Mock jwt.verify to return decoded token
    jwt.verify.mockReturnValue({ userId: mockUserId });

    await authMiddleware(req, res, next);

    // Verify jwt.verify was called with correct token and secret
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);

    // Verify req.user is set correctly
    expect(req.user).toEqual({ id: mockUserId });

    // Verify next() is called without error (success case)
    expect(next).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

