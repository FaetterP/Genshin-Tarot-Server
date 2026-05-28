/**
 * RippleOfFatePlus - Вытягивает 2 карты. Даёт 2 энергии за каждую карту Моны, вытянутую этим эффектом.
 * Тип: Attack. Стоимость: 0
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

describe("RippleOfFatePlus - вытягивает 2 карты, даёт 2 энергии за каждую карту Моны", () => {
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

  it("тянет 2 карты без карт Моны — DrawCards с 2 картами, энергия не начисляется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.RippleOfFatePlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const drawStep = response.steps.find((s: any) => s.type === EDetailedStep.DrawCards);
    expect(drawStep).toBeDefined();
    expect(drawStep.cards).toHaveLength(2);

    expect(response.steps.some((s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "energy")).toBe(false);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.RippleOfFatePlus }),
      }),
    );
  });

  it("тянет 2 карты Моны — 2 шага PlayerStatChange(energy, +2), итого +4 энергии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { energy: 0 });

    // admin.addCard("deck") кладёт карту с deckPosition=1 (первая к вытягиванию)
    // Первый вызов: MirrorReflections → pos 1
    // Второй вызов: RippleOfFate → pos 1 (MirrorReflections смещается на pos 2)
    // Итого: RippleOfFate тянется первым, MirrorReflections — вторым
    await admin.addCard(player.playerId, ECard.MirrorReflections, "deck");
    await admin.addCard(player.playerId, ECard.RippleOfFate, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.RippleOfFatePlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const energySteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "energy",
    );
    expect(energySteps).toHaveLength(2);
    expect(energySteps[0]).toMatchObject(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", delta: 2 }),
    );
    expect(energySteps[1]).toMatchObject(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", delta: 2 }),
    );

    const drawStep = response.steps.find((s: any) => s.type === EDetailedStep.DrawCards);
    expect(drawStep).toBeDefined();
    expect(drawStep.cards).toHaveLength(2);

    expect(response.player.energy).toBe(4);
  });

  it("тянет 1 карту Моны и 1 обычную — 1 шаг PlayerStatChange(energy, +2), итого +2 энергии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { energy: 0 });

    // Добавляем 1 карту Моны на вершину колоды
    await admin.addCard(player.playerId, ECard.MirrorReflectionsPlus, "deck");

    const cardId = await ensureCardInHand(player, admin, ECard.RippleOfFatePlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const energySteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "energy",
    );
    expect(energySteps).toHaveLength(1);
    expect(energySteps[0]).toMatchObject(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", delta: 2 }),
    );

    const drawStep = response.steps.find((s: any) => s.type === EDetailedStep.DrawCards);
    expect(drawStep).toBeDefined();
    expect(drawStep.cards).toHaveLength(2);

    expect(response.player.energy).toBe(2);
  });

  it("стоит 0 AP — работает даже при 0 AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.RippleOfFatePlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.DrawCards }),
    );
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player1, admin, ECard.RippleOfFatePlus);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.RippleOfFatePlus);
    expect(response2.card).toBe(ECard.RippleOfFatePlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
