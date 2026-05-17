/**
 * GuideOfAfterlife - Получите 1 урон. Получите 1 энергию или вытяните 2 карты. На этом ходу ваши обычные атаки будут накладывать Пиро.
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EPlayerEffect } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("GuideOfAfterlife — получить 1 урон, +энергия или 2 карты, атаки накладывают Пиро в этот ход", () => {
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

  it("основной режим: игрок получает 1 урон, +1 энергия, добавляется эффект GuideOfAfterlife", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { hp: 10, energy: 0, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.GuideOfAfterlife);
    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerTakeDamage,
        playerId: player.playerId,
        damage: 1,
        isPiercing: false,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.playerId,
        delta: 1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.GuideOfAfterlife,
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
        card: expect.objectContaining({ name: ECard.GuideOfAfterlife }),
      }),
    );

    expect(response.player.hp).toBe(9);
    expect(response.player.energy).toBe(1);
    expect(response.player.effects).toContain(EPlayerEffect.GuideOfAfterlife);
  });

  it("альтернативный режим: игрок получает 1 урон, вытягивает 2 карты, добавляется эффект", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { hp: 10, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.GuideOfAfterlife);
    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerTakeDamage,
        playerId: player.playerId,
        damage: 1,
        isPiercing: false,
      }),
    );

    const drawStep = response.steps.find((s: any) => s.type === EDetailedStep.DrawCards);
    expect(drawStep).toBeDefined();
    expect(drawStep.cards).toHaveLength(2);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.GuideOfAfterlife,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy" }),
    );

    expect(response.player.effects).toContain(EPlayerEffect.GuideOfAfterlife);
  });

  it("Attack-карта с активным эффектом накладывает Пиро на врага", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { hp: 10, energy: 0, actionPoints: { normal: 3, extra: 0 } });

    const guideId = await ensureCardInHand(player, admin, ECard.GuideOfAfterlife);
    player.send({ action: "game.useCard", cardId: guideId });
    await player.waitFor((m: any) => m.action === "game.useCard");

    const attackCardId = await ensureCardInHand(player, admin, ECard.SpearOfWangsheng);
    player.send({ action: "game.useCard", cardId: attackCardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.elements).toContain(EElement.Pyro);
  });

  it("эффект снимается при завершении хода", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { hp: 10, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.GuideOfAfterlife);
    player.send({ action: "game.useCard", cardId });
    await player.waitFor((m: any) => m.action === "game.useCard");

    player.send({ action: "game.endTurn" });
    const endTurnMsg = await player.waitFor(
      (m: any) => m.action === "game.endTurn" && m.playerID === player.playerId,
    );

    expect(endTurnMsg.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerLoseEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.GuideOfAfterlife,
      }),
    );

    const cycle2 = await player.waitFor((m: any) => m.action === "game.startCycle");
    expect(cycle2.you.effects).not.toContain(EPlayerEffect.GuideOfAfterlife);
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.GuideOfAfterlife);
    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { hp: 10, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.GuideOfAfterlife);
    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.GuideOfAfterlife);
    expect(response2.card).toBe(ECard.GuideOfAfterlife);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
