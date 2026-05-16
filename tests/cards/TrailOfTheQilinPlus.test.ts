/**
 * TrailOfTheQilinPlus - Выбранный враг в вашей зоне не атакует в этом ходу.
 * В начале следующего хода накладывает Крио и наносит 2 урона всем врагам в вашей зоне.
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EPlayerEffect } from "../../src/types/enums";
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

describe("TrailOfTheQilinPlus — оглушает врага в зоне, в начале следующего цикла Крио + 2 урона всем врагам", () => {
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

  it("оглушает врага и вешает эффект игроку", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.TrailOfTheQilinPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.TrailOfTheQilin,
      }),
    );
    expect(response.player.effects).toContain(EPlayerEffect.TrailOfTheQilin);

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.isStunned).toBe(true);
  });

  it("уменьшает AP на 1, карта перемещается в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.TrailOfTheQilinPlus);

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
        card: expect.objectContaining({ name: ECard.TrailOfTheQilinPlus }),
      }),
    );
  });

  it("в начале следующего цикла наносит 2 Крио урона врагу и снимает эффект", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.TrailOfTheQilinPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    await player.waitFor((m: any) => m.action === "game.useCard");

    const cycle2 = await endTurn(player);

    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Cryo,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 2,
        isPiercing: false,
        element: EElement.Cryo,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerEffectTrigger,
        playerId: player.playerId,
        effect: EPlayerEffect.TrailOfTheQilin,
        isRemove: true,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerLoseEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.TrailOfTheQilin,
      }),
    );
    expect(cycle2.you.effects).not.toContain(EPlayerEffect.TrailOfTheQilin);
  });

  it("возвращает ошибку если враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.TrailOfTheQilinPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("no enemies");
  });

  it("возвращает ошибку если враг вне зоны игрока", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const targetEnemy = player2.enemies[0];
    await admin.updateEnemy(targetEnemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.TrailOfTheQilinPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [targetEnemy.id] });
    const response = await player1.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("enemy is not in range");
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.TrailOfTheQilinPlus);

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
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.TrailOfTheQilinPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.TrailOfTheQilinPlus);
    expect(response2.card).toBe(ECard.TrailOfTheQilinPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
