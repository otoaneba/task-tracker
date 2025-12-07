// Import Jest globals for ESM
import { jest, describe, test, expect, beforeAll } from '@jest/globals';
import { NotFoundError } from '../../../src/utils/errors.js';

// Mock modules for ESM - when ANYONE imports taskModel.js or db.js later, use THIS mocked version instead.
jest.unstable_mockModule("../../../src/models/taskModel.js", () => ({
  TaskModel: { createTask: jest.fn(), findTaskById: jest.fn() }
}));

// mock DB for ESM
jest.unstable_mockModule("../../../src/config/db.js", () => ({
  default: {}
}));

// Use dynamic imports after mocks
let TaskService, ValidationError, TaskModel;

beforeAll(async () => {
  const taskServiceModule = await import("../../../src/services/taskService.js");
  const errorsModule = await import("../../../src/utils/errors.js");
  const taskModelModule = await import("../../../src/models/taskModel.js");
  
  TaskService = taskServiceModule.TaskService; // this is the real service.
  ValidationError = errorsModule.ValidationError;
  TaskModel = taskModelModule.TaskModel;
});

/*********************************************************/
/********************** createTask ***********************/
/*********************************************************/
describe("TaskService.createTask - validation error", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("throws ValidationError when title is missing", async () => {
    const payload = { userId: 1 };

    await expect(TaskService.createTask(payload))
      .rejects.toBeInstanceOf(ValidationError);

    expect(TaskModel.createTask).not.toHaveBeenCalled();
  });

  test("throws ValidationError when title is an empty string", async () => {
    const payload = { userId: 1, title: ""};

    await expect(TaskService.createTask(payload))
      .rejects.toBeInstanceOf(ValidationError);

    expect(TaskModel.createTask).not.toHaveBeenCalled();

  });

  test("throws ValidationError when status is not one of 'todo' or 'done'", async () => {
    const payload = { userId: 1, title: "title", status: "notTodo"};

    await expect(TaskService.createTask(payload))
      .rejects.toBeInstanceOf(ValidationError);

    expect(TaskModel.createTask).not.toHaveBeenCalled();

  });

  test("throws ValidationError when dueDate is provided but is not a valid date string", async () => {
    const payload = { userId: 1, title: "title", status: "todo", dueDate: "banana"};

    await expect(TaskService.createTask(payload))
      .rejects.toBeInstanceOf(ValidationError);

    expect(TaskModel.createTask).not.toHaveBeenCalled();

  });

  test("throws ValidationError when description is provided but is not a string", async () => {
    const payload = { userId: 1, title: "title", status: "todo", description: 0};

    await expect(TaskService.createTask(payload))
      .rejects.toBeInstanceOf(ValidationError);

    expect(TaskModel.createTask).not.toHaveBeenCalled();

  });

  test("trims the title before calling TaskModel.createTask", async () => {
    // Arrange
    const payload = {
      userId: 1,
      title: "   hello world   "
    };
  
    const mockCreatedRow = { id: 123, userId: 1, title: "hello world" };
  
    // Make the model return something
    TaskModel.createTask.mockResolvedValue(mockCreatedRow);
  
    // Act
    const result = await TaskService.createTask(payload);
  
    // Assert
    expect(TaskModel.createTask).toHaveBeenCalledTimes(1);
  
    // Check that the title was trimmed before being passed to the model
    expect(TaskModel.createTask).toHaveBeenCalledWith({
      userId: 1,
      title: "hello world",
      description: undefined,
      imageUrl: undefined,
      status: "todo",    // default
      dueDate: undefined,
    });
  
    // Service should return what the model returns
    expect(result).toEqual(mockCreatedRow);
  });

});


describe("TaskService.getTaskById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls model with correct arguments", async () => {
    const payload = {taskId: 10, userId: 1};

    const mockCreatedRow = {
      id: 10,
      userId: 1,
      title: undefined,
      description: undefined,
      dueDate: undefined,
      status: "todo",
      imageUrl: undefined
    };

    TaskModel.findTaskById.mockResolvedValue(mockCreatedRow);

    await TaskService.getTaskById(payload);

    expect(TaskModel.findTaskById).toHaveBeenCalledWith(10, 1);

  });

  test("throws NotFound if row was not found", async () => {
    const payload = {taskId: 10, userId: 1};

    TaskModel.findTaskById.mockResolvedValue(null);

    await expect(TaskService.getTaskById(payload))
    .rejects.toBeInstanceOf(NotFoundError);
    
    expect(TaskModel.findTaskById).toHaveBeenCalledWith(10, 1);

  });
})




