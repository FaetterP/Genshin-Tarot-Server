/**
 * HeraldOfFrostPlus - Накладывает Крио 1 врагу где угодно. На этом ходу следующий игрок,
 * который атакует этого врага, восстановит 3 ОЗ и получит 2 энергии.
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EEnemyEffect } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("HeraldOfFrostPlus — Крио + эффект: следующий атакующий получает 3 ОЗ и 2 энергии", () => {
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

  it("накладывает Крио и эффект HeraldOfFrostPlus на врага", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.HeraldOfFrostPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Cryo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetEffect,
        enemyId: enemy.id,
        effect: EEnemyEffect.HeraldOfFrostPlus,
      }),
    );
    const enemyState = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyState.elements).toContain(EElement.Cryo);
    expect(enemyState.effects).toContain(EEnemyEffect.HeraldOfFrostPlus);
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.HeraldOfFrostPlus }) }),
    );
  });

  it("следующий атакующий получает 3 ОЗ и 2 энергии; эффект снимается", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 }, hp: 8, energy: 0 });

    const heraldId = await ensureCardInHand(player, admin, ECard.HeraldOfFrostPlus);
    player.send({ action: "game.useCard", cardId: heraldId, enemies: [enemy.id] });
    await player.waitFor((m: any) => m.action === "game.useCard");

    const attackId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);
    player.send({ action: "game.useCard", cardId: attackId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player.playerId,
        amount: 3,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.playerId,
        delta: 2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyEffectTrigger,
        enemyId: enemy.id,
        effect: EEnemyEffect.HeraldOfFrostPlus,
        isRemove: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyLoseEffect,
        enemyId: enemy.id,
        effect: EEnemyEffect.HeraldOfFrostPlus,
      }),
    );
    expect(response.player.hp).toBe(11);
    expect(response.player.energy).toBe(2);
    const enemyState = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyState.effects).not.toContain(EEnemyEffect.HeraldOfFrostPlus);
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.ForeignRockblade }) }),
    );
  });

  it("ошибка: enemies не передан", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.HeraldOfFrostPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("ошибка: недостаточно AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.HeraldOfFrostPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.HeraldOfFrostPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.HeraldOfFrostPlus);
    expect(response2.card).toBe(ECard.HeraldOfFrostPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
