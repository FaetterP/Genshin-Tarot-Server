/**
 * StarfellSwordPlus — Накладывает Гео и наносит 2 пронзающего урона всем врагам в вашей зоне.
 * Тип: Skill. Стоимость: 1 очко действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { StarfellSwordPlus } from "../../src/storage/cards/Aether/StarfellSwordPlus";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
import { EDetailedStep, EElement } from "../../src/types/enums";
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

describe("StarfellSwordPlus — Накладывает Гео и наносит 2 пронзающего урона всем врагам в вашей зоне", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: StarfellSwordPlus;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    player.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 } });
    card = new StarfellSwordPlus();
    player.addCardToHand(card);
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

  it("рассылает шаги всем игрокам: EnemyTakeDamage → EnemyGetElement → PlayerStatChange(ap) → MoveCard", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const elementIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy.ID,
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

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(elementIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(elementIdx);
    expect(elementIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 2,
      isPiercing: true,
      element: EElement.Geo,
    });
    expect(steps[elementIdx]).toEqual({
      type: EDetailedStep.EnemyGetElement,
      enemyId: enemy.ID,
      element: EElement.Geo,
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
    expect(enemy.Health).toBe(3);
  });

  it("враг погибает при оставшихся ровно 2 HP — EnemyTakeDamage идёт перед EnemyDeath", async () => {
    const enemy = addEnemy(2);

    await useCard(ws, { cardId: card.ID });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const deathIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyDeath && s.enemyId === enemy.ID,
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

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(deathIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(deathIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 2,
      isPiercing: true,
      element: EElement.Geo,
    });
    expect(enemy.Health).toBe(0);
  });

  it("пронзающий урон игнорирует щит — EnemyBlockDamage отсутствует, HP уменьшается", async () => {
    const enemy = addEnemy(5, 1);

    await useCard(ws, { cardId: card.ID });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const blockIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyBlockDamage && s.enemyId === enemy.ID,
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

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(blockIdx).toBe(-1);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 2,
      isPiercing: true,
      element: EElement.Geo,
    });
    expect(enemy.Health).toBe(3);
  });

  it("два врага в зоне — оба получают EnemyTakeDamage и EnemyGetElement в порядке добавления", async () => {
    const firstEnemy = addEnemy(5);
    const secondEnemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID });

    const { steps } = getResponse();
    const damage1Idx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === firstEnemy.ID,
    );
    const element1Idx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === firstEnemy.ID,
    );
    const damage2Idx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === secondEnemy.ID,
    );
    const element2Idx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === secondEnemy.ID,
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

    expect(damage1Idx).toBeGreaterThanOrEqual(0);
    expect(element1Idx).toBeGreaterThanOrEqual(0);
    expect(damage2Idx).toBeGreaterThanOrEqual(0);
    expect(element2Idx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damage1Idx).toBeLessThan(element1Idx);
    expect(element1Idx).toBeLessThan(damage2Idx);
    expect(damage2Idx).toBeLessThan(element2Idx);
    expect(element2Idx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[damage1Idx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: firstEnemy.ID,
      damage: 2,
      isPiercing: true,
      element: EElement.Geo,
    });
    expect(steps[damage2Idx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: secondEnemy.ID,
      damage: 2,
      isPiercing: true,
      element: EElement.Geo,
    });
    expect(firstEnemy.Health).toBe(3);
    expect(secondEnemy.Health).toBe(3);
  });

  it("нет врагов в зоне — EnemyTakeDamage отсутствует, AP и сброс карты всё равно происходят", async () => {
    await useCard(ws, { cardId: card.ID });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex((s) => s.type === EDetailedStep.EnemyTakeDamage);
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

    expect(damageIdx).toBe(-1);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

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
  });
});
