/**
 * Breastplate - Накладывает Гео всем врагам в вашей зоне. Восстанавливает вам 1 ОЗ.
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from "@jest/globals";
import { ECard, EDetailedStep, EElement, EEnemy } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  spawnTestBoss,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("Breastplate — накладывает Гео на всех врагов в зоне и восстанавливает 1 ОЗ", () => {
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

  it("накладывает Гео на единственного врага, восстанавливает 1 ОЗ и генерирует стандартные шаги", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { hp: 8 });
    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.Breastplate);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy.id, element: EElement.Geo }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerHeal, playerId: player.playerId, amount: 1 }),
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
        card: expect.objectContaining({ name: ECard.Breastplate }),
      }),
    );
    expect(response.player.hp).toBe(9);
  });

  it("накладывает Гео на каждого врага при нескольких врагах", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    await admin.addEnemy(player.playerId, EEnemy.SmallDendroSlime);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const faceUpEnemies: { id: string }[] = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    for (const e of faceUpEnemies) {
      await admin.updateEnemy(e.id, { elements: [] });
    }

    const cardId = await ensureCardInHand(player, admin, ECard.Breastplate);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    for (const e of faceUpEnemies) {
      expect(response.steps).toContainEqual(
        expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: e.id, element: EElement.Geo }),
      );
    }
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerHeal, playerId: player.playerId, amount: 1 }),
    );
  });

  it("накладывает Гео на босса в сессии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
    await admin.updateBoss({ hp: 20, shield: 0, elements: [] });
    await admin.updateEnemy(player.enemies[0].id, { elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.Breastplate);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: bossId, element: EElement.Geo }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerHeal, playerId: player.playerId, amount: 1 }),
    );
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player1.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    const cardId = await ensureCardInHand(player1, admin, ECard.Breastplate);

    player1.send({ action: "game.useCard", cardId });
    const [res1, res2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(res1.player.playerId).toBe(player1.playerId);
    expect(res2.player.playerId).toBe(player1.playerId);
    expect(res1.card).toBe(ECard.Breastplate);
    expect(res2.card).toBe(ECard.Breastplate);
  });
});
