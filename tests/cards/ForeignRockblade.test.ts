/**
 * ForeignRockblade — Наносит 3 урона 1 врагу в вашей зоне.
 * Тип: Атака. Стоимость: 1 очко действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { ForeignRockblade } from "../../src/storage/cards/Aether/ForeignRockblade";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
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

describe("ForeignRockblade — Наносит 3 урона 1 врагу в вашей зоне", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: ForeignRockblade;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    card = new ForeignRockblade();
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

  it("рассылает шаги всем игрокам: EnemyTakeDamage → PlayerChangeActionPoints → DiscardCard", async () => {
    const enemy = addEnemy(7);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && (s as any).enemyId === enemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        (s as any).stat === "actionPoints" &&
        (s as any).playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        (s as any).to === "discard" &&
        (s as any).playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    // порядок: сначала урон, потом списание AP, потом сброс карты
    expect(damageIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 3,
      isPiercing: false,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -1,
    });
    expect(enemy.Health).toBe(4);
  });

  it("враг погибает при оставшихся ровно 3 HP — EnemyTakeDamage идёт перед EnemyDeath", async () => {
    const enemy = addEnemy(3);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && (s as any).enemyId === enemy.ID,
    );
    const deathIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyDeath && (s as any).enemyId === enemy.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(deathIdx).toBeGreaterThanOrEqual(0);
    // UI сначала показывает анимацию урона, потом гибель врага
    expect(damageIdx).toBeLessThan(deathIdx);
    expect(enemy.Health).toBe(0);
  });

  it("щит врага блокирует урон — EnemyTakeDamage идёт перед EnemyBlockDamage, HP не меняется", async () => {
    const enemy = addEnemy(7, 1);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && (s as any).enemyId === enemy.ID,
    );
    const blockIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyBlockDamage && (s as any).enemyId === enemy.ID,
    );

    // карта всегда добавляет EnemyTakeDamage до вызова applyAttack —
    // UI должен показать анимацию удара, затем отбивания щитом
    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(blockIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(blockIdx);
    expect(enemy.Health).toBe(7);
  });

  it("при нескольких врагах в запросе удар наносится только первому (ctx.enemies[0])", async () => {
    const firstEnemy = addEnemy(7);
    const secondEnemy = addEnemy(7);

    await useCard(ws, { cardId: card.ID, enemies: [firstEnemy.ID, secondEnemy.ID] });

    expect(firstEnemy.Health).toBe(4);
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
