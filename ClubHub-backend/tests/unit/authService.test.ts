const adminMock = vi.hoisted(() => ({
  findOne: vi.fn(),
  findByPk: vi.fn(),
}));

const bcryptMock = vi.hoisted(() => ({
  compare: vi.fn(),
}));

vi.mock("../../src/models/Admin", () => ({
  default: adminMock,
}));

vi.mock("bcrypt", () => ({
  default: bcryptMock,
}));

import AuthService from "../../src/services/auth.service";

describe("AuthService", () => {
  beforeEach(() => {
    adminMock.findOne.mockReset();
    adminMock.findByPk.mockReset();
    bcryptMock.compare.mockReset();
  });

  it("aceita password curta quando corresponde ao hash guardado", async () => {
    const save = vi.fn();
    adminMock.findOne.mockResolvedValue({
      id: 0,
      userName: "diogo",
      password: "hashed-password",
      role: "admin",
      save,
    });
    bcryptMock.compare.mockResolvedValue(true);

    const tokens = await AuthService.login(" diogo ", "1234");

    expect(adminMock.findOne).toHaveBeenCalledWith({
      where: { userName: "diogo" },
    });
    expect(bcryptMock.compare).toHaveBeenCalledWith("1234", "hashed-password");
    expect(tokens).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(save).toHaveBeenCalledOnce();
  });

  it("rejeita password vazia", async () => {
    await expect(AuthService.login("diogo", "")).rejects.toMatchObject({
      statusCode: 401,
    });

    expect(adminMock.findOne).not.toHaveBeenCalled();
  });
});
