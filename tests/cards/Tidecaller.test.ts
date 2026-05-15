/**
 * Tidecaller - Накладывает Электро всем врагам в вашей зоне. Даёт 2 защиты.
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

describe("Tidecaller — накладывает Электро всем врагам в зоне, даёт 2 защиты", () => {
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

  it("накладывает Электро врагу и даёт 2 защиты, списывает 1 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { shield: 0, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.Tidecaller);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Electro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player.playerId,
        delta: 2,
      }),
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
        card: expect.objectContaining({ name: ECard.Tidecaller }),
      }),
    );

    expect(response.player.shields).toBe(2);
  });

  it("накладывает Электро на всех врагов в зоне (2 врага)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.addEnemy(player.playerId, EEnemy.SmallDendroSlime);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    const enemies: { id: string }[] = syncMsg.you.enemies;

    for (const e of enemies) {
      await admin.updateEnemy(e.id, { hp: 10, shield: 0, elements: [] });
    }
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.Tidecaller);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    for (const e of enemies) {
      expect(response.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyGetElement,
          enemyId: e.id,
          element: EElement.Electro,
        }),
      );
    }
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        delta: 2,
      }),
    );
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.Tidecaller);

    player.send({ action: "game.useCard", cardId });
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

    const cardId = await ensureCardInHand(player1, admin, ECard.Tidecaller);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.Tidecaller);
    expect(response2.card).toBe(ECard.Tidecaller);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
