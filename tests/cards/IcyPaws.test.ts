/**
 * IcyPaws - Даёт 3 защиты ИЛИ накладывает Крио на всех врагов в вашей зоне и выбрасывает карту Горение из вашей колоды сброса.
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

describe("IcyPaws — даёт 3 защиты ИЛИ накладывает Крио на всех врагов в зоне и выбрасывает Горение из сброса", () => {
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

  it("без isUseAlternative: даёт игроку 3 защиты", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 }, shield: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player.playerId,
        delta: 3,
      }),
    );
    expect(response.player.shields).toBe(3);
  });

  it("без isUseAlternative: не накладывает Крио на врагов", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const elementSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyGetElement);
    expect(elementSteps.length).toBe(0);
  });

  it("isUseAlternative: накладывает Крио на врага в зоне", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Cryo,
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.elements).toContain(EElement.Cryo);
  });

  it("isUseAlternative: накладывает Крио на каждого врага при нескольких врагах в зоне", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const firstEnemy = player.enemies[0];
    await admin.updateEnemy(firstEnemy.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    const enemies: { id: string }[] = syncMsg.you.enemies;
    for (const e of enemies) {
      await admin.updateEnemy(e.id, { hp: 10, shield: 0, elements: [] });
    }

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    for (const e of enemies) {
      expect(response.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyGetElement,
          enemyId: e.id,
          element: EElement.Cryo,
        }),
      );
    }
  });

  it("isUseAlternative: не даёт защиты", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 }, shield: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const shieldSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "shield",
    );
    expect(shieldSteps.length).toBe(0);
    expect(response.player.shields).toBe(0);
  });

  it("isUseAlternative: выбрасывает карту Горение из сброса", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    await admin.addCard(player.playerId, ECard.Burn, "discard");
    await admin.waitFor((m: any) => {
      if (m.action !== "admin.state") return false;
      const ps = m.players?.find((p: any) => p.playerId === player.playerId);
      return ps?.discard?.some((c: any) => c.name === ECard.Burn);
    });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "trash",
        card: expect.objectContaining({ name: ECard.Burn }),
      }),
    );
    expect(response.player.discard.some((c: any) => c.name === ECard.Burn)).toBe(false);
  });

  it("isUseAlternative: работает без ошибок если Горения нет в сбросе", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Cryo,
      }),
    );
    const trashSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.MoveCard && s.to === "trash",
    );
    expect(trashSteps.length).toBe(0);
  });

  it("уменьшает AP на 1 и перемещает карту в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId });
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
        card: expect.objectContaining({ name: ECard.IcyPaws }),
      }),
    );
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcyPaws);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.IcyPaws);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.IcyPaws);
    expect(response2.card).toBe(ECard.IcyPaws);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
