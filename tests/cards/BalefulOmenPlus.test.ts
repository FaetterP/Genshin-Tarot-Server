/**
 * BalefulOmenPlus - Накладывает Электро всем врагам в вашей зоне. Размещает 2 🟣 на вас и 1 на другом игроке (макс. 5).
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("BalefulOmenPlus — Электро всем врагам; 2 🟣 себе + 1 другому", () => {
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

  it("2 игрока: Электро врагам, 2 raidenPoints себе и 1 другому игроку", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player1.playerId, raidenPoints: 0 });
    await admin.request({ action: "admin.updatePlayer", playerId: player2.playerId, raidenPoints: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmenPlus);

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
        playerId: player1.playerId,
        delta: 2,
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
        card: expect.objectContaining({ name: ECard.BalefulOmenPlus }),
      }),
    );

    expect(response.player.raidenPoints).toBe(2);
  });

  it("1 игрок без selectedPlayer: 2 raidenPoints себе, шага для другого нет", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, raidenPoints: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.BalefulOmenPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Electro,
      }),
    );

    const selfRaidenSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "raidenPoints" && s.playerId === player.playerId,
    );
    expect(selfRaidenSteps).toHaveLength(1);
    expect(selfRaidenSteps[0].delta).toBe(2);

    expect(response.player.raidenPoints).toBe(2);
  });

  it("кап себя: уже 4 raidenPoints → delta:1 (min(2, 5-4)=1)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, raidenPoints: 4 });

    const cardId = await ensureCardInHand(player, admin, ECard.BalefulOmenPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const selfRaidenSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "raidenPoints" && s.playerId === player.playerId,
    );
    expect(selfRaidenSteps).toHaveLength(1);
    expect(selfRaidenSteps[0].delta).toBe(1);

    expect(response.player.raidenPoints).toBe(5);
  });

  it("кап себя: уже 5 raidenPoints → шага PlayerStatChange(raidenPoints) для себя нет", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, raidenPoints: 5 });

    const cardId = await ensureCardInHand(player, admin, ECard.BalefulOmenPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const selfRaidenSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "raidenPoints" && s.playerId === player.playerId,
    );
    expect(selfRaidenSteps).toHaveLength(0);

    expect(response.player.raidenPoints).toBe(5);
  });

  it("кап selectedPlayer: уже 5 → шага для другого игрока нет, себе всё равно даёт", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 } });
    await admin.request({ action: "admin.updatePlayer", playerId: player1.playerId, raidenPoints: 0 });
    await admin.request({ action: "admin.updatePlayer", playerId: player2.playerId, raidenPoints: 5 });

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmenPlus);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "raidenPoints",
        playerId: player1.playerId,
        delta: 2,
      }),
    );

    const player2RaidenSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "raidenPoints" && s.playerId === player2.playerId,
    );
    expect(player2RaidenSteps).toHaveLength(0);
  });

  it("возвращает ошибку при недостатке AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.BalefulOmenPlus);

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

    const cardId = await ensureCardInHand(player1, admin, ECard.BalefulOmenPlus);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.BalefulOmenPlus);
    expect(response2.card).toBe(ECard.BalefulOmenPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
