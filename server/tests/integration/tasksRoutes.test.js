import { jest, describe, test, expect, beforeAll, beforeEach } from "@jest/globals";
import request from "supertest";

// Mock database connection to prevent connection attempts
jest.unstable_mockModule("../../src/config/db.js", () => ({
  default: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  }
}));

// Mock authMiddleware to always succeed
jest.unstable_mockModule("../../src/middleware/authMiddleWare.js", () => ({
  authMiddleware: (req, res, next) => {
    // Set req.user for all requests (simulating successful auth)
    req.user = { id: 1 };
    next();
  }
}));

// Mock TaskService
jest.unstable_mockModule("../../src/services/taskService.js", () => ({
  TaskService: {
    getTaskById: jest.fn(),
    getTasksForUser: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
  }
}));

let app;
let TaskService;

beforeAll(async () => {
  // Import mocked TaskService
  const taskServiceModule = await import("../../src/services/taskService.js");
  TaskService = taskServiceModule.TaskService;

  // Import the app (which will use mocked authMiddleware)
  const appModule = await import("../../src/app.js");
  app = appModule.default;
});

describe("GET /tasks/:taskId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 with task data", async () => {
    const mockTask = {
      id: 10,
      user_id: 1,
      title: "Milk",
      description: "Buy milk",
      image_url: null,
      status: "todo",
      due_date: null,
      created_at: "2024-01-15T10:30:00.000Z",
      updated_at: "2024-01-15T10:30:00.000Z"
    };

    TaskService.getTaskById.mockResolvedValue(mockTask);

    const res = await request(app)
      .get("/tasks/10")
      .set("Authorization", "Bearer faketoken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTask);

    expect(TaskService.getTaskById).toHaveBeenCalledWith({
      taskId: "10", // params come as strings from Express
      userId: 1
    });
  });
});
