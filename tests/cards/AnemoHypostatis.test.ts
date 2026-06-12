/**
 * AnemoHypostatis - Накладывает Анемо на 1 врага где угодно.
 * Вы можете перевернуть 1 другого врага где угодно лицом вниз поверх первого.
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EEnemy } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("AnemoHypostatis — накладывает Анемо на 1 врага, можно перевернуть второго поверх", () => {
  let game: TestGame;

  beforeAll(async () => {
    await startTestServers();
  });

  afterAll(async () => {
    await stopTestServers();
  });

  beforeEach(() => {
    resetGame();
  });

  afterEach(() => {
    game?.cleanup();
  });

  it("накладывает Анемо на 1 врага (основной сценарий)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatis);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyFlipFaceDown }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.AnemoHypostatis }),
      }),
    );
  });

  it("реакция Анемо добавляет Рывок в сброс игрока", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [EElement.Pyro] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatis);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: enemy.id,
      }),
    );
    expect(response.player.discard.some((c: any) => c.name === ECard.Dash)).toBe(true);
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: -1,
      }),
    );
  });

  it("переворачивает второго врага поверх первого", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const target = player1.enemies[0];
    const flipTarget = player2.enemies[0];
    await admin.updateEnemy(target.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(flipTarget.id, { hp: 8, shield: 2, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.AnemoHypostatis);

    player1.send({ action: "game.useCard", cardId, enemies: [target.id, flipTarget.id] });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: target.id,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyFlipFaceDown,
        coveredByEnemyId: target.id,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: -1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.AnemoHypostatis }),
      }),
    );
  });

  it("второй враг (для флипа) может быть из своей зоны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e2 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 6, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatis);

    player.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyFlipFaceDown,
        coveredByEnemyId: e1.id,
      }),
    );
  });

  it("возвращает ошибку при отсутствии врагов", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatis);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("no enemies");
  });

  it("возвращает ошибку при передаче больше двух врагов", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const e1 = player1.enemies[0];
    const e2 = player2.enemies[0];

    await admin.addEnemy(player1.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player1.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e3 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);

    const cardId = await ensureCardInHand(player1, admin, ECard.AnemoHypostatis);

    player1.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id, e3.id] });
    const response = await player1.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("need 1-2 enemies");
  });

  it("возвращает ошибку при передаче одного и того же врага дважды", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatis);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id, enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("same enemies");
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatis);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.AnemoHypostatis);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.AnemoHypostatis);
    expect(response2.card).toBe(ECard.AnemoHypostatis);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
