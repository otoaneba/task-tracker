import { jest, describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { ValidationError } from "../../../src/utils/errors.js";

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

let errorHandler;

beforeAll(async () => {
  // Import the actual error handler
  errorHandler = (await import("../../../src/middleware/errorHandler.js")).errorHandler
});

describe("errorHandler", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create fresh mock objects for each test
    req = {
      path: "/api/tasks",
      method: "GET"
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();
  });

  test("errorHandler - ", async () => {
    errorHandler(new ValidationError("Bad", {}), req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ details: {}, error: "Bad" });  

  });
});

