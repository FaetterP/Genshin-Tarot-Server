/**
 * MirrorReflections - Выбранный 1 враг (не босс) в вашей зоне не атакует в этом ходу.
 * В начале следующего хода накладывает Гидро и наносит 2 урона всем врагам в вашей зоне.
 * Тип: Skill. Стоимость: 2
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EEnemy, EPlayerEffect } from "../../src/types/enums";
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

describe("MirrorReflections - оглушает врага, в начале следующего цикла Гидро + 2 урона всем врагам", () => {
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

  it("добавляет эффект MirrorReflections, оглушает врага, списывает 2 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.MirrorReflections);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.MirrorReflections,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.MirrorReflections }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.isStunned).toBe(true);
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyStun,
        enemyId: enemy.id,
      }),
    );
    expect(response.player.effects).toContain(EPlayerEffect.MirrorReflections);
    expect(response.player.actionPoints.total).toBe(1);
  });

  it("эффект срабатывает в начале цикла 2 — EnemyGetElement(Hydro), EnemyTakeDamage(2), эффект снимается", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.MirrorReflections);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    await player.waitFor((m: any) => m.action === "game.useCard");

    await admin.setLeylines([]);
    const cycle2 = await endTurn(player);

    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Hydro,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 2,
        isPiercing: false,
        element: EElement.Hydro,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerEffectTrigger,
        playerId: player.playerId,
        effect: EPlayerEffect.MirrorReflections,
        isRemove: true,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerLoseEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.MirrorReflections,
      }),
    );

    expect(cycle2.you.effects).not.toContain(EPlayerEffect.MirrorReflections);

    const enemyAfter = cycle2.you.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyAfter.hp).toBe(8);
  });

  it("эффект в цикле 2 бьёт всех врагов в зоне (2 врага)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const enemies: { id: string }[] = syncMsg.you.enemies.filter((e: any) => !e.faceDown);

    for (const e of enemies) {
      await admin.updateEnemy(e.id, { hp: 10, shield: 0, elements: [] });
    }
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.MirrorReflections);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id] });
    await player.waitFor((m: any) => m.action === "game.useCard");

    await admin.setLeylines([]);
    const cycle2 = await endTurn(player);

    for (const e of enemies) {
      expect(cycle2.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyGetElement,
          enemyId: e.id,
          element: EElement.Hydro,
        }),
      );
      expect(cycle2.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: e.id,
          damage: 2,
          isPiercing: false,
        }),
      );
    }
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.MirrorReflections);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("no enemies");
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0 });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 1, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.MirrorReflections);

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
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.MirrorReflections);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.MirrorReflections);
    expect(response2.card).toBe(ECard.MirrorReflections);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
