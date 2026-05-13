/**
 * WeissBladework — Наносит 2 урона 1 врагу в вашей зоне. Даёт 2 энергии, если на враге есть Гео.
 * Тип: Attack. Стоимость: 1 очко действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { WeissBladework } from "../../src/storage/cards/Albedo/WeissBladework";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
import { Geo } from "../../src/storage/elements/Geo";
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

describe("WeissBladework — Наносит 2 урона 1 врагу в вашей зоне. Даёт 2 энергии, если на враге есть Гео", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: WeissBladework;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    player.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 }, energy: 0 });
    card = new WeissBladework();
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

  it("рассылает шаги всем игрокам: EnemyTakeDamage → PlayerStatChange(ap) → MoveCard, HP уменьшается", async () => {
    const enemy = addEnemy(7);

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
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 2,
      isPiercing: false,
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
    expect(enemy.Health).toBe(5);
    expect(player.Energy).toBe(0);
  });

  it("враг погибает при оставшихся ровно 2 HP — EnemyTakeDamage идёт перед EnemyDeath", async () => {
    const enemy = addEnemy(2);

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
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
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
      isPiercing: false,
    });
    expect(enemy.Health).toBe(0);
    expect(player.Energy).toBe(0);
  });

  it("щит врага блокирует урон — EnemyTakeDamage идёт перед EnemyBlockDamage, HP не меняется", async () => {
    const enemy = addEnemy(7, 1);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

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
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(blockIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(blockIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 2,
      isPiercing: false,
    });
    expect(enemy.Health).toBe(7);
    expect(player.Energy).toBe(0);
  });

  it("враг с Гео — PlayerStatChange(energy, +2) после EnemyTakeDamage, энергия начислена", async () => {
    const enemy = addEnemy(7);
    enemy.applyElement(new Geo(), player);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const energyIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "energy" &&
        s.playerId === player.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(energyIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(energyIdx);
    expect(energyIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 2,
      isPiercing: false,
    });
    expect(steps[energyIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "energy",
      playerId: player.ID,
      delta: 2,
    });
    expect(enemy.Health).toBe(5);
    expect(player.Energy).toBe(2);
  });

  it("враг с Гео погибает — EnemyTakeDamage и PlayerStatChange(energy) присутствуют, HP = 0, Energy = 2", async () => {
    const enemy = addEnemy(2);
    enemy.applyElement(new Geo(), player);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const energyIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "energy" &&
        s.playerId === player.ID,
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
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(energyIdx).toBeGreaterThanOrEqual(0);
    expect(deathIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(deathIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 2,
      isPiercing: false,
    });
    expect(steps[energyIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "energy",
      playerId: player.ID,
      delta: 2,
    });
    expect(enemy.Health).toBe(0);
    expect(player.Energy).toBe(2);
  });

  it("при нескольких врагах в запросе удар наносится только первому (ctx.enemies[0])", async () => {
    const firstEnemy = addEnemy(7);
    const secondEnemy = addEnemy(7);

    await useCard(ws, { cardId: card.ID, enemies: [firstEnemy.ID, secondEnemy.ID] });

    expect(firstEnemy.Health).toBe(5);
    expect(secondEnemy.Health).toBe(7);
  });

  it("выбрасывает ошибку, если поле enemies не передано в запросе", async () => {
    addEnemy(7);

    await expect(useCard(ws, { cardId: card.ID })).rejects.toThrow("no enemies");
  });

  it("выбрасывает ошибку, если передан пустой список врагов", async () => {
    addEnemy(7);

    await expect(useCard(ws, { cardId: card.ID, enemies: [] })).rejects.toThrow("no enemies");
  });
});
