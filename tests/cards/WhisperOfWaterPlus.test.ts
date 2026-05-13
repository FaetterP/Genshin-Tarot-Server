/**
 * WhisperOfWaterPlus — Восстанавливает 2 ОЗ себе и 1 другому игроку.
 * Тип: Attack. Стоимость: 1 очко действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { WhisperOfWaterPlus } from "../../src/storage/cards/Barbara/WhisperOfWaterPlus";
import { EDetailedStep } from "../../src/types/enums";
import { GameUseCardResponse } from "../../src/types/response";
import { createGameState, makeWs } from "../helpers/setup";
import { CycleController } from "../../src/game/CycleController";
import { Player } from "../../src/game/Player";
import { ExtWebSocket } from "../../src/types/wsTypes";

jest.mock("../../src/utils/wsUtils", () => ({
  sendToAll: jest.fn(),
  sendToAllAndWait: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../src/ws", () => ({
  getAllClients: jest.fn(() => []),
  getAllPlayers: jest.fn(() => []),
  sendResponseToAdmin: jest.fn(),
  sendStateToClients: jest.fn(),
  getGameStateSnapshot: jest.fn(() => ({})),
  cycleController: null,
  startGameWSS: jest.fn(),
  stopGameWSS: jest.fn(),
  startAdminWSS: jest.fn(),
  stopAdminWSS: jest.fn(),
}));

const mockedSendToAll = sendToAll as jest.MockedFunction<typeof sendToAll>;
const useCard = gameHandlers.handlers.useCard;

describe("WhisperOfWaterPlus — Восстанавливает 2 ОЗ себе и 1 другому игроку", () => {
  let cycleController: CycleController;
  let player: Player;
  let otherPlayer: Player;
  let card: WhisperOfWaterPlus;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    player.adminSetStats({ hp: 10, actionPoints: { normal: 3, extra: 0 } });
    card = new WhisperOfWaterPlus();
    player.addCardToHand(card);

    ({ player: otherPlayer } = createGameState());
    otherPlayer.adminSetStats({ hp: 10, actionPoints: { normal: 3, extra: 0 } });
    cycleController.connectPlayer(otherPlayer);

    ws = makeWs(player, cycleController);
  });

  function getResponse(): GameUseCardResponse {
    return mockedSendToAll.mock.calls[0][0] as GameUseCardResponse;
  }

  it("без selectedPlayer: PlayerHeal(player, 2) → PlayerStatChange(ap) → MoveCard, HP игрока +2", async () => {
    await useCard(ws, { cardId: card.ID });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const healIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerHeal && s.playerId === player.ID && s.amount === 2,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(healIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(healIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[healIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: player.ID,
      amount: 2,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -1,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(player.Health).toBe(12);
  });

  it("с selectedPlayer: PlayerHeal(player, 2) → PlayerHeal(selectedPlayer, 1) → ap → MoveCard, оба получают HP", async () => {
    await useCard(ws, { cardId: card.ID, selectedPlayer: otherPlayer.ID });

    const { steps } = getResponse();

    const healSelfIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerHeal && s.playerId === player.ID && s.amount === 2,
    );
    const healOtherIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerHeal && s.playerId === otherPlayer.ID && s.amount === 1,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(healSelfIdx).toBeGreaterThanOrEqual(0);
    expect(healOtherIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(healSelfIdx).toBeLessThan(healOtherIdx);
    expect(healOtherIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[healSelfIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: player.ID,
      amount: 2,
    });
    expect(steps[healOtherIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: otherPlayer.ID,
      amount: 1,
    });
    expect(player.Health).toBe(12);
    expect(otherPlayer.Health).toBe(11);
  });

  it("игрок с максимальным HP (12) не превышает 12 после лечения", async () => {
    player.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 } });

    await useCard(ws, { cardId: card.ID });

    expect(player.Health).toBe(12);
  });

  it("лечение selectedPlayer не превышает 12 HP", async () => {
    otherPlayer.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 } });

    await useCard(ws, { cardId: card.ID, selectedPlayer: otherPlayer.ID });

    expect(otherPlayer.Health).toBe(12);
  });
});
