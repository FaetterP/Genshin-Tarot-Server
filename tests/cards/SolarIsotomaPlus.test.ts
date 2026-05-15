/**
 * SolarIsotomaPlus - Накладывает Гео всем врагам в вашей зоне. В начале следующего хода, накладывает Гео всем врагам в вашей зоне.
 * Вы можете выбросить карту из вашей руки или сброса чтобы вытянуть карту.
 * Тип: Skill. Стоимость: 1
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
  advanceCycle,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("SolarIsotomaPlus — накладывает Гео всем врагам в зоне, в начале следующего цикла накладывает Гео снова", () => {
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

  it("применяет Гео врагу и вешает эффект игроку", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Geo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.SolarIsotoma,
      }),
    );
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
        card: expect.objectContaining({ name: ECard.SolarIsotomaPlus }),
      }),
    );
    expect(response.player.actionPoints.total).toBe(2);
    expect(response.player.effects).toContain(EPlayerEffect.SolarIsotoma);
  });

  it("эффект срабатывает в начале следующего цикла, вызывает реакцию Гео+Гео и исчезает", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

    player.send({ action: "game.useCard", cardId });
    await player.waitFor((m: any) => m.action === "game.useCard");

    const cycle2 = await endTurn(player);

    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: enemy.id,
        element1: EElement.Geo,
        element2: EElement.Geo,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerEffectTrigger,
        playerId: player.playerId,
        effect: EPlayerEffect.SolarIsotoma,
        isRemove: true,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerLoseEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.SolarIsotoma,
      }),
    );
    expect(cycle2.you.effects).not.toContain(EPlayerEffect.SolarIsotoma);
  });

  it("применяет Гео всем врагам в зоне (2 врага), эффект срабатывает для обоих", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

    await admin.addEnemy(player.playerId, EEnemy.SmallDendroSlime);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    const enemies: { id: string }[] = syncMsg.you.enemies;

    for (const e of enemies) {
      await admin.updateEnemy(e.id, { hp: 20, shield: 0, elements: [] });
    }
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    for (const e of enemies) {
      expect(response.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyGetElement,
          enemyId: e.id,
          element: EElement.Geo,
        }),
      );
    }
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
        card: expect.objectContaining({ name: ECard.SolarIsotomaPlus }),
      }),
    );

    const cycle2 = await endTurn(player);

    for (const e of enemies) {
      expect(cycle2.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyReaction,
          enemyId: e.id,
          element1: EElement.Geo,
          element2: EElement.Geo,
        }),
      );
    }
  });

  it("selectedCard выбрасывает карту из руки и вытягивает новую", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.addCard(player.playerId, ECard.ForeignRockblade, "hand");
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.hand.some((c: any) => c.name === ECard.ForeignRockblade),
    );
    const selectedCardId: string = syncMsg.you.hand.find((c: any) => c.name === ECard.ForeignRockblade).cardId;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

    player.send({ action: "game.useCard", cardId, selectedCard: selectedCardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Geo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "trash",
        card: expect.objectContaining({ name: ECard.ForeignRockblade }),
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.DrawCards,
        playerId: player.playerId,
      }),
    );
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
        card: expect.objectContaining({ name: ECard.SolarIsotomaPlus }),
      }),
    );
  });

  it("selectedCard выбрасывает карту из сброса и вытягивает новую", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.addCard(player.playerId, ECard.ForeignRockblade, "discard");
    const adminState = await admin.waitFor((m: any) => m.action === "admin.state");
    const playerState = adminState.players.find((p: any) => p.playerId === player.playerId);
    const selectedCardId: string = playerState.discard.find(
      (c: any) => c.name === ECard.ForeignRockblade,
    ).cardId;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

    player.send({ action: "game.useCard", cardId, selectedCard: selectedCardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Geo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "trash",
        card: expect.objectContaining({ name: ECard.ForeignRockblade }),
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.DrawCards,
        playerId: player.playerId,
      }),
    );
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
        card: expect.objectContaining({ name: ECard.SolarIsotomaPlus }),
      }),
    );
  });

  it("возвращает ошибку когда selectedCard является самой картой", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

    player.send({ action: "game.useCard", cardId, selectedCard: cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("возвращает ошибку когда selectedCard не найдена", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

    player.send({ action: "game.useCard", cardId, selectedCard: "non-existent-id" });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.SolarIsotomaPlus);

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
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.SolarIsotomaPlus);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.SolarIsotomaPlus);
    expect(response2.card).toBe(ECard.SolarIsotomaPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
