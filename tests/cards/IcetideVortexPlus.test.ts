/**
 * IcetideVortexPlus - Накладывает Крио 1 врагу в вашей зоне. Вы можете вместо этого найти в колоде карту Эолы
 * и добавить её в руку. Если карты нету, добавить все карты Эолы из колоды сброса.
 * Тип: Skill. Стоимость: 0
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

describe("IcetideVortexPlus — накладывает Крио ИЛИ достаёт карты Эолы из колоды/сброса; стоимость 0", () => {
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

  it("без isUseAlternative: накладывает Крио на врага", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcetideVortexPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
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

  it("стоимость 0: работает при 0 AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcetideVortexPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Cryo,
      }),
    );
  });

  it("isUseAlternative: берёт первую карту Эолы из колоды в руку", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcetideVortexPlus);

    await admin.addCard(player.playerId, ECard.EdelBladework, "deck");
    await admin.waitFor((m: any) => {
      if (m.action !== "admin.state") return false;
      const ps = m.players?.find((p: any) => p.playerId === player.playerId);
      return ps?.deck?.some((c: any) => c.name === ECard.EdelBladework);
    });

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "hand",
        card: expect.objectContaining({ name: ECard.EdelBladework }),
      }),
    );

    expect(response.player.hand.some((c: any) => c.name === ECard.EdelBladework)).toBe(true);
  });

  it("isUseAlternative: колода без карт Эолы — берёт все карты Эолы из сброса", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcetideVortexPlus);

    await admin.addCard(player.playerId, ECard.IcetideVortex, "discard");
    await admin.addCard(player.playerId, ECard.EdelBladeworkPlus, "discard");
    await admin.waitFor((m: any) => {
      if (m.action !== "admin.state") return false;
      const ps = m.players?.find((p: any) => p.playerId === player.playerId);
      return ps?.discard?.filter((c: any) =>
        [ECard.IcetideVortex, ECard.EdelBladeworkPlus].includes(c.name)
      ).length >= 2;
    });

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "hand",
        card: expect.objectContaining({ name: ECard.IcetideVortex }),
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "hand",
        card: expect.objectContaining({ name: ECard.EdelBladeworkPlus }),
      }),
    );

    const handNames = response.player.hand.map((c: any) => c.name);
    expect(handNames).toContain(ECard.IcetideVortex);
    expect(handNames).toContain(ECard.EdelBladeworkPlus);
  });

  it("isUseAlternative: нет карт Эолы нигде — карта разыгрывается без эффекта", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcetideVortexPlus);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.status).not.toBe("error");

    const moveToHandSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.MoveCard && s.to === "hand",
    );
    expect(moveToHandSteps.length).toBe(0);
  });

  it("не уменьшает AP (стоимость 0) и перемещает карту в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.IcetideVortexPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const apSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "actionPoints",
    );
    expect(apSteps.length).toBe(0);
    expect(response.player.actionPoints.total).toBe(3);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.IcetideVortexPlus }),
      }),
    );
  });

  it("без isUseAlternative и без врагов: возвращает ошибку", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.IcetideVortexPlus);

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
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.IcetideVortexPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.IcetideVortexPlus);
    expect(response2.card).toBe(ECard.IcetideVortexPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
