/**
 * MaidsBladeworkPlus - Вытягивает 3 карты. Даёт 2 Защиты.
 * Тип: Attack. Стоимость: 0
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from "@jest/globals";
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

describe("MaidsBladeworkPlus — вытягивает 3 карты и даёт 2 Защиты", () => {
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

  it("вытягивает 3 карты, добавляет 2 Защиты и стандартные шаги", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { shield: 0 });
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladeworkPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const drawStep = response.steps.find(
      (s: any) => s.type === EDetailedStep.DrawCards && s.playerId === player.playerId,
    );
    expect(drawStep).toBeDefined();
    expect(drawStep.cards).toHaveLength(3);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player.playerId,
        delta: 2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.MaidsBladeworkPlus }),
      }),
    );
    expect(response.player.shields).toBe(2);
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player1, admin, ECard.MaidsBladeworkPlus);

    player1.send({ action: "game.useCard", cardId });
    const [res1, res2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(res1.player.playerId).toBe(player1.playerId);
    expect(res2.player.playerId).toBe(player1.playerId);
    expect(res1.card).toBe(ECard.MaidsBladeworkPlus);
    expect(res2.card).toBe(ECard.MaidsBladeworkPlus);
  });
});
