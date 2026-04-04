import { jest } from "@jest/globals";

const mockCreate = jest.fn();
const mockFindOne = jest.fn();

jest.unstable_mockModule("../src/models/task.model.js", () => ({
  Task: {
    create: mockCreate,
    findOne: mockFindOne,
  },
}));

const { createTask } = await import("../src/controllers/task.controller.js");

describe("createTask controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a task successfully and return 201", async () => {
    const req = {
      body: {
        title: "Study Jest",
        description: "Learn controller testing properly",
        priority: "High",
      },
      user: {
        _id: "user123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const createdTask = {
      _id: "task123",
      title: "Study Jest",
      description: "Learn controller testing properly",
      priority: "High",
      userId: "user123",
    };

    // 🔥 important
    mockFindOne.mockResolvedValue(null); // no duplicate
    mockCreate.mockResolvedValue(createdTask);

    await createTask(req, res);

    expect(mockFindOne).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
});