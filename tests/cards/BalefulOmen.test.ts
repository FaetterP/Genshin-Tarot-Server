/**
 * BalefulOmen - Накладывает Электро всем врагам в вашей зоне. Размещает 1 🟣 на другом игроке (макс. 5).
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

describe("BalefulOmen — Электро всем врагам в зоне; 1 🟣 другому игроку", () => {
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

  it("2 игрока: Электро врагу в зоне player1, даёт 1 raidenPoint player2", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player2.playerId, raidenPoints: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmen);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

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
        stat: "raidenPoints",
        playerId: player2.playerId,
        delta: 1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player1.playerId,
        delta: -1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.BalefulOmen }),
      }),
    );

    const raidenSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "raidenPoints" && s.playerId === player1.playerId,
    );
    expect(raidenSteps).toHaveLength(0);
  });

  it("1 игрок без selectedPlayer: Электро применяется, raidenPoints никому не даются", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.BalefulOmen);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Electro,
      }),
    );

    const raidenSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "raidenPoints",
    );
    expect(raidenSteps).toHaveLength(0);

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard" }),
    );
  });

  it("не добавляет raidenPoints если selectedPlayer уже на максимуме (5)", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player2.playerId, raidenPoints: 5 });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmen);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy.id }),
    );

    const raidenSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "raidenPoints",
    );
    expect(raidenSteps).toHaveLength(0);
  });

  it("даёт delta:1 если selectedPlayer.raidenPoints == 4 (частичный кап)", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player2.playerId, raidenPoints: 4 });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmen);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "raidenPoints",
        playerId: player2.playerId,
        delta: 1,
      }),
    );
  });

  it("применяет Электро нескольким врагам в зоне игрока", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.addEnemy(player1.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player1.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const visibleEnemies = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    const [enemy1, enemy2] = visibleEnemies;

    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmen);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy1.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy2.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "raidenPoints", playerId: player2.playerId, delta: 1 }),
    );
  });

  it("Электро в зоне player1 не применяется к врагам player2", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy1 = player1.enemies[0];
    const enemy2 = player2.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmen);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    const getElementForEnemy2 = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy2.id,
    );
    expect(getElementForEnemy2).toHaveLength(0);
  });

  it("возвращает ошибку при недостатке AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.BalefulOmen);

    player.send({ action: "game.useCard", cardId });
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
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmen);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.BalefulOmen);
    expect(response2.card).toBe(ECard.BalefulOmen);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
