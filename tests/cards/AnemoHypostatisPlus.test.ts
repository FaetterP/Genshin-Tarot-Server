/**
 * AnemoHypostatisPlus - Накладывает Анемо всем врагам в вашей зоне.
 * За каждую вызванную реакцию: восстановить 3 HP любому игроку или получить карту Рывок.
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
  spawnTestBoss,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("AnemoHypostatisPlus — накладывает Анемо на всех врагов в зоне", () => {
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

  it("босс в сессии получает BossAnemoImmunity вместо элемента Анемо", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
    await admin.updateBoss({ hp: 20, shield: 0, elements: [] });
    await admin.updateEnemy(player.enemies[0].id, { elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatisPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.BossAnemoImmunity,
        bossId,
      }),
    );
  });

  it("накладывает Анемо без реакций (враги без элементов)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatisPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyReaction }),
    );
    expect(response.player.discard.some((c: any) => c.name === ECard.Dash)).toBe(false);
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
        card: expect.objectContaining({ name: ECard.AnemoHypostatisPlus }),
      }),
    );
  });

  it("реакция + isHeal=false → EnemyReaction шаг и Рывок в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [EElement.Pyro] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatisPlus);

    player.send({ action: "game.useCard", cardId });

    const reactionMsg = await player.waitFor((m: any) => m.action === "game.anemoReaction");
    expect(reactionMsg.enemyId).toBe(enemy.id);

    player.send({
      action: "game.anemoReactionResponse",
      taskId: reactionMsg.taskId,
      isHeal: false,
    });

    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Anemo,
      }),
    );
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

  it("реакция + isHeal=true → PlayerHeal шаг, без Рывка в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [EElement.Pyro] });
    await admin.updatePlayer(player.playerId, { hp: 5 });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatisPlus);

    player.send({ action: "game.useCard", cardId });

    const reactionMsg = await player.waitFor((m: any) => m.action === "game.anemoReaction");

    player.send({
      action: "game.anemoReactionResponse",
      taskId: reactionMsg.taskId,
      isHeal: true,
      targetPlayerId: player.playerId,
    });

    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player.playerId,
        amount: 3,
      }),
    );
    expect(response.player.discard.some((c: any) => c.name === ECard.Dash)).toBe(false);
    expect(response.player.hp).toBe(8);
  });

  it("две реакции подряд (два врага с элементами)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [EElement.Pyro] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const faceUpEnemies = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    const e2 = faceUpEnemies.find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [EElement.Pyro] });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatisPlus);

    player.send({ action: "game.useCard", cardId });

    const reaction1 = await player.waitFor((m: any) => m.action === "game.anemoReaction");
    player.send({
      action: "game.anemoReactionResponse",
      taskId: reaction1.taskId,
      isHeal: false,
    });

    const reaction2 = await player.waitFor((m: any) => m.action === "game.anemoReaction");
    player.send({
      action: "game.anemoReactionResponse",
      taskId: reaction2.taskId,
      isHeal: false,
    });

    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: e1.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: e2.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyReaction, enemyId: e1.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyReaction, enemyId: e2.id }),
    );
    const dashCount = response.player.discard.filter((c: any) => c.name === ECard.Dash).length;
    expect(dashCount).toBe(2);
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.AnemoHypostatisPlus);

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

    const cardId = await ensureCardInHand(player1, admin, ECard.AnemoHypostatisPlus);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.AnemoHypostatisPlus);
    expect(response2.card).toBe(ECard.AnemoHypostatisPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
