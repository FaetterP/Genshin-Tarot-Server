/**
 * SpearOfTheChurch - Наносит 1 пронзающий урон 1 врагу в вашей зоне.
 * Вы можете потратить 1 энергию, чтобы нанести 1 пронзающий урон 1 другому врагу где угодно.
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

describe("SpearOfTheChurch — наносит 1 пронзающий урон, опционально 2-й удар за 1 энергию", () => {
  let game: TestGame;

  beforeAll(async () => { await startTestServers(); });
  afterAll(async () => { await stopTestServers(); });
  beforeEach(() => { resetGame(); });
  afterEach(() => { game?.cleanup(); });

  it("наносит 1 пронзающий урон, враг выживает, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfTheChurch);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.SpearOfTheChurch }),
      }),
    );
    expect(response.player.enemies.find((e: any) => e.id === enemy.id).hp).toBe(9);
  });

  it("isPiercing пронзает щит — HP уменьшается, EnemyBlockDamage отсутствует", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 2, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfTheChurch);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

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
    expect(response.player.enemies.find((e: any) => e.id === enemy.id).hp).toBe(9);
  });

  it("убивает врага с 1 HP — EnemyDeath, враг пропадает из enemies", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 1, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfTheChurch);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy.id }),
    );
    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
  });

  it("isUseAlternative с энергией — бьёт 2 разных врага, тратит 1 энергию", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy1 = player1.enemies[0];
    const enemy2 = player2.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { energy: 1 });

    const cardId = await ensureCardInHand(player1, admin, ECard.SpearOfTheChurch);

    player1.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy1.id, enemy2.id],
      isUseAlternative: true,
    });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy2.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player1.playerId,
        delta: -1,
      }),
    );
  });

  it("isUseAlternative без энергии — только первый враг получает урон", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy1 = player1.enemies[0];
    const enemy2 = player2.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { energy: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.SpearOfTheChurch);

    player1.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy1.id, enemy2.id],
      isUseAlternative: true,
    });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy1.id }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy2.id }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy" }),
    );
  });

  it("возвращает ошибку если enemies не переданы", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.SpearOfTheChurch);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.SpearOfTheChurch);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.SpearOfTheChurch);
    expect(response2.card).toBe(ECard.SpearOfTheChurch);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
