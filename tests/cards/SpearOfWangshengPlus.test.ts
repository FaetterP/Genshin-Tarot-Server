/**
 * SpearOfWangshengPlus - Получите 1 урон. Нанесите 1 пронзающий урон 1 врагу в вашей зоне. Если у вас 7 ОЗ или меньше (после урона), наносит 4 пронзающего урона и замешивает себя обратно в колоду.
 * Тип: Attack. Стоимость: 0
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("SpearOfWangshengPlus — игрок получает 1 урон; при HP ≤ 7 — 4 пронзающего урона и карта в колоду", () => {
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

  it("HP > 7: игрок получает 1 урон, наносит 1 пронзающий урон, карта уходит в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { hp: 10 });

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfWangshengPlus);
    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerTakeDamage,
        playerId: player.playerId,
        damage: 1,
        isPiercing: false,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: 0,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.SpearOfWangshengPlus }),
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "deck",
        card: expect.objectContaining({ name: ECard.SpearOfWangshengPlus }),
      }),
    );

    expect(response.player.hp).toBe(9);
    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
    expect(response.player.discard.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(true);
    expect(response.player.deck.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(false);
    expect(response.player.hand.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(false);
  });

  it("HP = 8 (→ 7 после урона): наносит 4 пронзающего урона, карта замешивается в колоду", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { hp: 8 });

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfWangshengPlus);
    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerTakeDamage,
        playerId: player.playerId,
        damage: 1,
        isPiercing: false,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 4,
        isPiercing: true,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "deck",
        card: expect.objectContaining({ name: ECard.SpearOfWangshengPlus }),
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.SpearOfWangshengPlus }),
      }),
    );

    expect(response.player.hp).toBe(7);
    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(6);
    expect(response.player.deck.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(true);
    expect(response.player.hand.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(false);
    expect(response.player.discard.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(false);
  });

  it("убивает врага с 4 HP при HP = 8 (→ 7 после урона, 4 пронзающего урона)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 4, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { hp: 8 });

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfWangshengPlus);
    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 4,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "deck",
        card: expect.objectContaining({ name: ECard.SpearOfWangshengPlus }),
      }),
    );

    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
    const appearanceSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyAppearance);
    expect(appearanceSteps.length).toBeGreaterThan(0);
    expect(response.player.deck.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(true);
    expect(response.player.hand.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(false);
    expect(response.player.discard.some((c: any) => c.name === ECard.SpearOfWangshengPlus)).toBe(false);
  });

  it("возвращает ошибку при отсутствии врага в запросе", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfWangshengPlus);
    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { hp: 10 });

    const cardId = await ensureCardInHand(player1, admin, ECard.SpearOfWangshengPlus);
    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.SpearOfWangshengPlus);
    expect(response2.card).toBe(ECard.SpearOfWangshengPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
