/**
 * Sharpshooter — Наносит 1 пронзающий урон 1 врагу где угодно.
 * Можно потратить 1 энергию (isUseAlternative), чтобы наложить Пиро на врага.
 * Тип: Attack. Стоимость: 0 очков действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { Sharpshooter } from "../../src/storage/cards/Amber/Sharpshooter";
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

describe("Sharpshooter — Наносит 1 пронзающий урон 1 врагу где угодно", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: Sharpshooter;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    card = new Sharpshooter();
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

  it("наносит 1 пронзающий урон без элемента, не тратит AP", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
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
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -card.Cost,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(enemy.Health).toBe(4);
  });

  it("isUseAlternative с энергией: тратит 1 энергию, накладывает Пиро, наносит 1 пронзающий урон", async () => {
    player.adminSetStats({ energy: 3 });
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID], isUseAlternative: true });

    const { steps } = getResponse();

    const energyIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "energy" &&
        s.playerId === player.ID,
    );
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
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

    expect(energyIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    // порядок: сначала энергия, потом урон
    expect(energyIdx).toBeLessThan(damageIdx);

    expect(steps[energyIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "energy",
      playerId: player.ID,
      delta: -1,
    });
    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 1,
      isPiercing: true,
      element: EElement.Pyro,
    });
    expect(enemy.Health).toBe(4);
  });

  it("isUseAlternative при 0 энергии выбрасывает ошибку", async () => {
    player.adminSetStats({ energy: 0 });
    const enemy = addEnemy(5);

    await expect(
      useCard(ws, { cardId: card.ID, enemies: [enemy.ID], isUseAlternative: true }),
    ).rejects.toThrow("not enough energy");
  });

  it("пронзающий урон проходит сквозь щит — враг теряет HP", async () => {
    const enemy = addEnemy(5, 1);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
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
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(enemy.Health).toBe(4);
  });

  it("враг погибает при ровно 1 HP — EnemyTakeDamage идёт перед EnemyDeath", async () => {
    const enemy = addEnemy(1);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

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
      damage: 1,
      isPiercing: true,
    });
    expect(enemy.Health).toBe(0);
  });

  it("бьёт врага в чужой зоне (isRange: true)", async () => {
    const { player: otherPlayer } = createGameState();
    cycleController.connectPlayer(otherPlayer);
    const enemy = new HilichurlGuard();
    enemy.adminSetStats({ hp: 5 });
    otherPlayer.addEnemy(enemy);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    expect(enemy.Health).toBe(4);
  });

  it("при нескольких врагах бьёт только первого (ctx.enemies[0])", async () => {
    const first = addEnemy(5);
    const second = addEnemy(5);

    await useCard(ws, { cardId: card.ID, enemies: [first.ID, second.ID] });

    expect(first.Health).toBe(4);
    expect(second.Health).toBe(5);
  });

  it("выбрасывает ошибку, если поле enemies не передано", async () => {
    addEnemy(5);
    await expect(useCard(ws, { cardId: card.ID })).rejects.toThrow("no enemies");
  });

  it("выбрасывает ошибку, если передан пустой список врагов", async () => {
    addEnemy(5);
    await expect(useCard(ws, { cardId: card.ID, enemies: [] })).rejects.toThrow("no enemies");
  });
});
