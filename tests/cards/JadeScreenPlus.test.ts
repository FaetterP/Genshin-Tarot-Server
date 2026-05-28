/**
 * JadeScreenPlus - Даёт вам и 1 другому игроку 3 Защиты и 1 энергию.
 * Тип: Skill. Стоимость: 1
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

describe("JadeScreenPlus - даёт 3 Защиты и 1 энергию вам и выбранному игроку", () => {
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

  it("два игрока — оба получают 3 Защиты и 1 энергию, списывает 1 AP, карта в сброс", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { shield: 0, energy: 0, actionPoints: { normal: 3, extra: 0 } });
    await admin.updatePlayer(player2.playerId, { shield: 0, energy: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.JadeScreenPlus);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player2.playerId,
        delta: 3,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player2.playerId,
        delta: 1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player1.playerId,
        delta: 3,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player1.playerId,
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
        card: expect.objectContaining({ name: ECard.JadeScreenPlus }),
      }),
    );

    expect(response.player.shields).toBe(3);
    expect(response.player.actionPoints.total).toBe(2);
  });

  it("один игрок — передаёт свой playerId, получает 6 Защит и 2 энергии (двойное применение)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { shield: 0, energy: 0, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.JadeScreenPlus);

    player.send({ action: "game.useCard", cardId, selectedPlayer: player.playerId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const shieldSteps = response.steps.filter(
      (s: any) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "shield" &&
        s.playerId === player.playerId &&
        s.delta === 3,
    );
    const energySteps = response.steps.filter(
      (s: any) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "energy" &&
        s.playerId === player.playerId &&
        s.delta === 1,
    );

    expect(shieldSteps).toHaveLength(2);
    expect(energySteps).toHaveLength(2);
    expect(response.player.shields).toBe(6);
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 0, extra: 0 } });
    const cardId = await ensureCardInHand(player1, admin, ECard.JadeScreenPlus);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard с шагами для обоих игроков", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { shield: 0, energy: 0, actionPoints: { normal: 3, extra: 0 } });
    await admin.updatePlayer(player2.playerId, { shield: 0, energy: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.JadeScreenPlus);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.JadeScreenPlus);
    expect(response2.card).toBe(ECard.JadeScreenPlus);
    expect(response2.player.playerId).toBe(player1.playerId);

    expect(response2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player2.playerId,
        delta: 3,
      }),
    );
    expect(response2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player2.playerId,
        delta: 1,
      }),
    );
  });
});
