/**
 * LayeredFrostPlus - Вытягивает 1 карту. На этом ходу ваши обычные атаки будут накладывать Крио.
 * Тип: Skill. Стоимость: 0
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EPlayerEffect } from "../../src/types/enums";
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

describe("LayeredFrostPlus — вытягивает 1 карту и даёт эффект: обычные атаки накладывают Крио (стоимость 0)", () => {
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

  it("вытягивает 1 карту и добавляет эффект LayeredFrost", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LayeredFrostPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.DrawCards,
        playerId: player.playerId,
        cards: expect.arrayContaining([expect.objectContaining({})]),
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.LayeredFrost,
      }),
    );
    expect(response.player.effects).toContain(EPlayerEffect.LayeredFrost);
  });

  it("Attack-карта с активным эффектом накладывает Крио на врага", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    // активируем эффект (стоит 0 AP)
    const layeredFrostId = await ensureCardInHand(player, admin, ECard.LayeredFrostPlus);
    player.send({ action: "game.useCard", cardId: layeredFrostId });
    await player.waitFor((m: any) => m.action === "game.useCard");

    // используем Attack-карту — она должна наложить Крио
    const attackCardId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);
    player.send({ action: "game.useCard", cardId: attackCardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.elements).toContain(EElement.Cryo);
  });

  it("стоит 0 AP — AP не списывается, карта уходит в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LayeredFrostPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: 0,
      }),
    );
    expect(response.player.actionPoints.total).toBe(3);
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.LayeredFrostPlus }),
      }),
    );
  });

  it("эффект снимается в начале следующего цикла", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LayeredFrostPlus);
    player.send({ action: "game.useCard", cardId });
    await player.waitFor((m: any) => m.action === "game.useCard");

    const cycle2 = await endTurn(player);

    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerEffectTrigger,
        playerId: player.playerId,
        effect: EPlayerEffect.LayeredFrost,
        isRemove: true,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerLoseEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.LayeredFrost,
      }),
    );
    expect(cycle2.you.effects).not.toContain(EPlayerEffect.LayeredFrost);
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.LayeredFrostPlus);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.LayeredFrostPlus);
    expect(response2.card).toBe(ECard.LayeredFrostPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
