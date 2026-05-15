/**
 * PassionOverload - Накладывает Пиро и наносит 2 урона 1 врагу в вашей зоне.
 * Сбрасывает карту сверху колоды. Если это было Горение или карта Беннета, получите 1 урон
 * и нанесите 1 урон всем врагам в вашей зоне. Карта Горение удаляется.
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

describe("PassionOverload - Накладывает Пиро и наносит 2 урона 1 врагу. Спецэффект при карте Беннета или Горения сверху колоды.", () => {
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

  it("наносит 2 Пиро урона и сбрасывает обычную карту сверху колоды", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    // добавляем нейтральную карту на вершину колоды
    await admin.addCard(player.playerId, ECard.ForeignRockblade, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 2,
        isPiercing: false,
        element: EElement.Pyro,
      }),
    );

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.ForeignRockblade }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(8);
  });

  it("срабатывает при карте Беннета сверху — карта в сброс, самоурон и АоЕ по всем врагам", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 20, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.SmallDendroSlime);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    const allEnemies: { id: string }[] = syncMsg.you.enemies;
    const enemy2 = allEnemies.find((e: any) => e.id !== enemy1.id)!;
    await admin.updateEnemy(enemy2.id, { hp: 20, shield: 0, elements: [] });

    // добавляем карту Беннета на вершину колоды
    await admin.addCard(player.playerId, ECard.StrikeOfFortune, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    // основной удар
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1.id,
        damage: 2,
        isPiercing: false,
        element: EElement.Pyro,
      }),
    );

    // карта Беннета уходит в сброс
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.StrikeOfFortune }),
      }),
    );

    // игрок получает 1 пронзающий урон
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerTakeDamage,
        playerId: player.playerId,
        damage: 1,
        isPiercing: true,
      }),
    );

    // АоЕ бьёт обоих врагов по 1 Пиро уроню
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1.id,
        damage: 1,
        isPiercing: false,
        element: EElement.Pyro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy2.id,
        damage: 1,
        isPiercing: false,
        element: EElement.Pyro,
      }),
    );
  });

  it("срабатывает при карте Горение сверху — карта идёт в корзину, самоурон и АоЕ", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });

    // добавляем Горение на вершину колоды
    await admin.addCard(player.playerId, ECard.Burn, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    // карта Горение идёт в корзину (не в сброс)
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "trash",
        card: expect.objectContaining({ name: ECard.Burn }),
      }),
    );

    // игрок получает 1 пронзающий урон
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerTakeDamage,
        playerId: player.playerId,
        damage: 1,
        isPiercing: true,
      }),
    );

    // АоЕ бьёт врага 1 Пиро уроном
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: false,
        element: EElement.Pyro,
      }),
    );
  });

  it("уменьшает AP игрока на 1 и перемещает карту в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    // нейтральная карта на вершину колоды, чтобы не сработал эффект
    await admin.addCard(player.playerId, ECard.ForeignRockblade, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -1,
      }),
    );
    expect(response.player.actionPoints.total).toBe(2);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.PassionOverload }),
      }),
    );
  });

  it("основной удар блокируется щитом врага — HP не изменяется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 2, elements: [] });

    await admin.addCard(player.playerId, ECard.ForeignRockblade, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 2,
        isPiercing: false,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyBlockDamage,
        enemyId: enemy.id,
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(10);
  });

  it("убивает врага с 2 HP и спавнит следующую волну", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 2, shield: 0, elements: [] });

    await admin.addCard(player.playerId, ECard.ForeignRockblade, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyDeath,
        enemyId: enemy.id,
      }),
    );
    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
    expect(
      response.steps.filter((s: any) => s.type === EDetailedStep.EnemyAppearance).length,
    ).toBeGreaterThan(0);
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0 });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.PassionOverload);

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

    await admin.addCard(player1.playerId, ECard.ForeignRockblade, "deck");

    const cardId = await ensureCardInHand(player1, admin, ECard.PassionOverload);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.PassionOverload);
    expect(response2.card).toBe(ECard.PassionOverload);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
