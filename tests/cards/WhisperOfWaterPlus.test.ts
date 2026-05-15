/**
 * WhisperOfWaterPlus - Восстанавливает 2 ОЗ себе и 1 другому игроку.
 * Тип: Attack. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("WhisperOfWaterPlus — восстанавливает 2 ОЗ себе и 1 другому игроку", () => {
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

  it("лечит себя на 2 ОЗ без selectedPlayer, списывает 1 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { hp: 5, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.WhisperOfWaterPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player.playerId,
        amount: 2,
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
        card: expect.objectContaining({ name: ECard.WhisperOfWaterPlus }),
      }),
    );

    expect(response.player.hp).toBe(7);
    expect(response.player.actionPoints.total).toBe(2);
  });

  it("с selectedPlayer — лечит себя на 2 и другого игрока на 1", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { hp: 5, actionPoints: { normal: 3, extra: 0 } });
    await admin.updatePlayer(player2.playerId, { hp: 5 });

    const cardId = await ensureCardInHand(player1, admin, ECard.WhisperOfWaterPlus);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player1.playerId,
        amount: 2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player2.playerId,
        amount: 1,
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
        card: expect.objectContaining({ name: ECard.WhisperOfWaterPlus }),
      }),
    );

    expect(response.player.hp).toBe(7);
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.WhisperOfWaterPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { hp: 5, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.WhisperOfWaterPlus);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.WhisperOfWaterPlus);
    expect(response2.card).toBe(ECard.WhisperOfWaterPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
