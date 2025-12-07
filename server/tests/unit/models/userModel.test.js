import { jest, describe, test, expect, beforeAll } from "@jest/globals";

// mock DB for ESM.
jest.unstable_mockModule("../../../src/config/db.js", () => ({
  default: { query: jest.fn() }
}));

let pool;
let UserModel;

beforeAll(async () => {
  pool = (await import("../../../src/config/db.js")).default;
  UserModel = (await import("../../../src/models/userModel.js")).UserModel; // this is the real model.
});

describe("UserModel tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });

  test("findByEmail", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 10 }] }); // not a real return value
  
    await UserModel.findByEmail("example@example.com");

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1", ["example@example.com"]);
  });
});