/**
 * ExplosivePuppetPlus — Выбранный враг (не босс) в вашей зоне не атакует в этом ходу.
 * В начале следующего хода накладывает Пиро и наносит 2 урона всем врагам в вашей зоне.
 * Тип: Skill. Стоимость: 1 очко действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { ExplosivePuppetPlus } from "../../src/storage/cards/Amber/ExplosivePuppetPlus";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
import { EDetailedStep, EPlayerEffect } from "../../src/types/enums";
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

describe("ExplosivePuppetPlus — Оглушает врага в зоне, взрывается в начале следующего хода (стоит 1 AP)", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: ExplosivePuppetPlus;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    card = new ExplosivePuppetPlus();
    player.addCardToHand(card);
    player.adminSetStats({ hp: 12, actionPoints: { normal: 3 } });
    ws = makeWs(player, cycleController);
  });

  function addEnemy(hp: number, shield = 0): HilichurlGuard {
    const enemy = new HilichurlGuard();
    enemy.adminSetStats({ hp, shield });
    player.addEnemy(enemy);
    return enemy;
  }

  function getResponse(): GameUseCardResponse {
    return mockedSendToAll.mock.calls[0][0] as GameUseCardResponse;
  }

  it("оглушает врага, добавляет эффект, тратит 1 AP (а не 2)", async () => {
    const enemy = addEnemy(7);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const effectIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerGetEffect &&
        s.playerId === player.ID &&
        s.effect === EPlayerEffect.ExplosivePuppet,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(effectIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[effectIdx]).toEqual({
      type: EDetailedStep.PlayerGetEffect,
      playerId: player.ID,
      effect: EPlayerEffect.ExplosivePuppet,
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
    expect(enemy.IsStunned).toBe(true);
  });

  it("выбрасывает ошибку, если враг не в зоне игрока", async () => {
    const { player: otherPlayer } = createGameState();
    cycleController.connectPlayer(otherPlayer);
    const enemy = new HilichurlGuard();
    enemy.adminSetStats({ hp: 7 });
    otherPlayer.addEnemy(enemy);

    await expect(useCard(ws, { cardId: card.ID, enemies: [enemy.ID] })).rejects.toThrow(
      "enemy is not in range",
    );
  });

  it("выбрасывает ошибку, если поле enemies не передано", async () => {
    addEnemy(7);
    await expect(useCard(ws, { cardId: card.ID })).rejects.toThrow("no enemies");
  });

  it("выбрасывает ошибку, если передан пустой список врагов", async () => {
    addEnemy(7);
    await expect(useCard(ws, { cardId: card.ID, enemies: [] })).rejects.toThrow("no enemies");
  });
});
