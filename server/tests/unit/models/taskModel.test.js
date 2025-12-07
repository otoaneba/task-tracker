import { jest, describe, test, expect, beforeAll, beforeEach } from "@jest/globals";

// mock DB for ESM.
jest.unstable_mockModule("../../../src/config/db.js", () => ({
  default: { query: jest.fn() }
}));

let pool;
let TaskModel;

beforeAll(async () => {
  pool = (await import("../../../src/config/db.js")).default;
  TaskModel = (await import("../../../src/models/taskModel.js")).TaskModel; // this is the real model.
});

describe("TaskModel - findTaskById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  test("calls pool.query with correct SQL and params", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 10 }] });

    await TaskModel.findTaskById(10, 1);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, user_id, title, description, image_url, status, due_date, created_at, updated_at FROM tasks WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL",
      [10, 1]
    );
  });

  test("returns a row without deleted_at", async () => {
    const payload = {userId: 1, id: 10 };

    const mockRow = { rows: [{user_id: 1, id: 10, title: "hello", description: "foo", image_url: undefined, status: "todo", due_date: undefined, created_at: "2024-01-15T10:30:00.000Z", updated_at: undefined}] };
    
    // mock db resolve to the mockRow
    pool.query.mockResolvedValue(mockRow);

    // call model with the payload
    const result = await TaskModel.findTaskById(payload.id, payload.userId)

    // assert
    expect(result).toEqual(mockRow.rows[0]);
  });

});
