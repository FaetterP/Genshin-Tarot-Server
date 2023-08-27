import { CycleController } from "../../src/game/CycleController";
import { Player } from "../../src/game/Player";

describe("game/CycleController connecting", () => {
  it("connect players", () => {
    const cycleController = new CycleController();

    const player1 = new Player();
    cycleController.connectPlayer(player1);
    expect(cycleController.PlayersCount).toBe(1);

    const player2 = new Player();
    cycleController.connectPlayer(player2);
    expect(cycleController.PlayersCount).toBe(2);
  });

  it("maximum 4 players", () => {
    const cycleController = new CycleController();

    cycleController.connectPlayer(new Player());
    cycleController.connectPlayer(new Player());
    cycleController.connectPlayer(new Player());
    cycleController.connectPlayer(new Player());

    expect(() => {
      cycleController.connectPlayer(new Player());
    }).toThrow("maximum players count");
  });

  it("doesn't connect connected player", () => {
    const cycleController = new CycleController();

    const player = new Player();
    cycleController.connectPlayer(player);

    expect(() => {
      cycleController.connectPlayer(player);
    }).toThrow("player already connected");
  });
});

describe("game/CycleController", () => {
  it("start game", () => {
    const cycleController = new CycleController();
    const player1 = new Player();
    const player2 = new Player();
    const cycleControllerStartCycleMock = jest
      .spyOn(cycleController, "startCycle")
      .mockImplementation(() => {});

    cycleController.connectPlayer(player1);
    cycleController.connectPlayer(player2);
    cycleController.startGame();

    expect(cycleController.CycleNumber).toBe(1);
    expect(cycleControllerStartCycleMock.mock.calls.length).toBe(1);
  });

  it("cannot start game without players", () => {
    const cycleController = new CycleController();

    expect(() => {
      cycleController.startGame();
    }).toThrow("cannot start game without players");
  });

  it("start cycle", () => {
    const cycleController = new CycleController();
    const player1 = new Player();
    const player2 = new Player();

    cycleController.connectPlayer(player1);
    cycleController.connectPlayer(player2);

    const player1StartCycleMock = jest
      .spyOn(player1, "startCycle")
      .mockImplementation(() => {});
    const player2StartCycleMock = jest
      .spyOn(player1, "startCycle")
      .mockImplementation(() => {});

    const cycleNumber = cycleController.CycleNumber;
    cycleController.startCycle();
    cycleController.startCycle();

    expect(cycleController.CycleNumber).toBe(cycleNumber);
    expect(player1StartCycleMock.mock.calls.length).toBe(2);
    expect(player2StartCycleMock.mock.calls.length).toBe(2);
  });

  it("end cycle", () => {
    const cycleController = new CycleController();
    const player1 = new Player();
    const player2 = new Player();

    cycleController.connectPlayer(player1);
    cycleController.connectPlayer(player2);

    const player1StartCycleMock = jest
      .spyOn(player1, "endCycle")
      .mockImplementation(() => {});
    const player2StartCycleMock = jest
      .spyOn(player1, "endCycle")
      .mockImplementation(() => {});

    const cycleNumber = cycleController.CycleNumber;
    cycleController.endCycle();
    cycleController.endCycle();

    expect(cycleController.CycleNumber).toBe(cycleNumber + 2);
    expect(player1StartCycleMock.mock.calls.length).toBe(2);
    expect(player2StartCycleMock.mock.calls.length).toBe(2);
  });

  it("cycles ends", () => {
    const cycleController = new CycleController();
    const player = new Player();

    const callbackMock = jest.fn(() => {});
    cycleController.OnCycleEnd.addListener(callbackMock);

    cycleController.connectPlayer(player);

    for (let i = 0; i < 13; i++) {
      cycleController.endCycle();
    }
    cycleController.startCycle();

    expect(callbackMock.mock.calls.length).toBe(1);
  });
});
