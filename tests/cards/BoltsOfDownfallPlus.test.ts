/**
 * BoltsOfDownfallPlus - Наносит 1 пронзающий урон 1 врагу где угодно.
 * Если эффект «Тень расправленных крыльев» сработал на этом ходу на этом враге, наносит 3 пронзающего урона.
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
  endTurn,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("BoltsOfDownfallPlus — 1 пронзающий урон, 3 если NightriderEffect сработал в этом цикле", () => {
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

  it("наносит 1 пронзающий урон если NightriderEffect не срабатывал, 0 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.BoltsOfDownfallPlus);

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
        card: expect.objectContaining({ name: ECard.BoltsOfDownfallPlus }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
  });

  it("пробивает щит: HP уменьшается, EnemyBlockDamage не генерируется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 3, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.BoltsOfDownfallPlus);

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
    const blockSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyBlockDamage);
    expect(blockSteps).toHaveLength(0);

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: 0,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.BoltsOfDownfallPlus }),
      }),
    );
  });

  it("наносит 3 пронзающих урона если NightriderEffect сработал в начале этого цикла", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });

    // Цикл 1: используем Nightrider, чтобы повесить NightriderEffect на врага
    const nightriderId = await ensureCardInHand(player, admin, ECard.Nightrider);
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    player.send({ action: "game.useCard", cardId: nightriderId, enemies: [enemy.id] });
    await player.waitFor((m: any) => m.action === "game.useCard");

    // Переходим в цикл 2 — NightriderEffect срабатывает и помечает врага hitByNightriderEffectThisTurn
    const cycle2 = await endTurn(player);

    // Берём свежий cardId из данных цикла 2 (ID может обновиться между циклами)
    const boltsPlusInHand = cycle2.you.hand.find((c: any) => c.name === ECard.BoltsOfDownfallPlus);
    const boltsId = boltsPlusInHand?.cardId ?? await ensureCardInHand(player, admin, ECard.BoltsOfDownfallPlus);

    // Цикл 2: используем BoltsOfDownfallPlus — должно нанести 3 урона
    player.send({ action: "game.useCard", cardId: boltsId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 3,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: 0,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.BoltsOfDownfallPlus }),
      }),
    );
  });

  it("убивает врага с 3 HP после NightriderEffect и спавнит следующую волну", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    // Достаточно HP для цикла 1 (1 урон от Nightrider) и реакции в цикле 2 (1 + 2 реакция),
    // но не для удара BoltsOfDownfallPlus (3 урона)
    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const nightriderId = await ensureCardInHand(player, admin, ECard.Nightrider);
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    player.send({ action: "game.useCard", cardId: nightriderId, enemies: [enemy.id] });
    await player.waitFor((m: any) => m.action === "game.useCard");

    const cycle2 = await endTurn(player);

    // Враг выжил в начале цикла 2
    const enemyAfterEffect = cycle2.you.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyAfterEffect).toBeDefined();

    // Устанавливаем HP = 3 чтобы BoltsOfDownfallPlus убил врага
    await admin.updateEnemy(enemy.id, { hp: 3 });

    // Берём свежий cardId из данных цикла 2
    const boltsPlusInHand = cycle2.you.hand.find((c: any) => c.name === ECard.BoltsOfDownfallPlus);
    const boltsId = boltsPlusInHand?.cardId ?? await ensureCardInHand(player, admin, ECard.BoltsOfDownfallPlus);

    player.send({ action: "game.useCard", cardId: boltsId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 3,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyDeath,
        enemyId: enemy.id,
      }),
    );
    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);

    const appearanceSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyAppearance);
    expect(appearanceSteps.length).toBeGreaterThan(0);
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.BoltsOfDownfallPlus }),
      }),
    );
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.BoltsOfDownfallPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("no enemies");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.BoltsOfDownfallPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.BoltsOfDownfallPlus);
    expect(response2.card).toBe(ECard.BoltsOfDownfallPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
