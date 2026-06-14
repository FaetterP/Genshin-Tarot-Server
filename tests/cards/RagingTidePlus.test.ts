/**
 * RagingTidePlus - Вытягивает 3 карты. Можно сбросить до 3 карт,
 * чтобы наложить Гидро на 1 врага в своей зоне за каждую сброшенную карту.
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

describe("RagingTidePlus — вытягивает 3 карты, опционально накладывает Гидро, 0 AP", () => {
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

  it("вытягивает 3 карты без сбросов, списывает 0 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.RagingTidePlus);

    player.send({ action: "game.useCard", cardId });

    const selectMsg = await player.waitFor((m: any) => m.action === "game.ragingTideSelect");

    player.send({
      action: "game.ragingTideSelectResponse",
      taskId: selectMsg.taskId,
      selectedCards: [],
      enemies: [],
    });

    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const drawStep = response.steps.find((s: any) => s.type === EDetailedStep.DrawCards);
    expect(drawStep).toBeDefined();
    expect(drawStep.cards).toHaveLength(3);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: 0,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.RagingTidePlus }),
      }),
    );
  });

  it("сброс 1 карты → Гидро на врага без элемента", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    await admin.addCard(player.playerId, ECard.BoltsOfDownfall, "hand");
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.hand.some((c: any) => c.name === ECard.BoltsOfDownfall),
    );
    const discardCardId = syncMsg.you.hand.find((c: any) => c.name === ECard.BoltsOfDownfall).cardId;

    const cardId = await ensureCardInHand(player, admin, ECard.RagingTidePlus);

    player.send({ action: "game.useCard", cardId });

    const selectMsg = await player.waitFor((m: any) => m.action === "game.ragingTideSelect");

    player.send({
      action: "game.ragingTideSelectResponse",
      taskId: selectMsg.taskId,
      selectedCards: [discardCardId],
      enemies: [enemy.id],
    });

    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const drawStep = response.steps.find((s: any) => s.type === EDetailedStep.DrawCards);
    expect(drawStep.cards).toHaveLength(3);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.BoltsOfDownfall }),
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Hydro,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyReaction }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: 0,
      }),
    );
  });

  it("сброс 1 карты → враг с Гидро → реакция Гидро+Гидро, игрок получает энергию", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [EElement.Hydro] });
    await admin.updatePlayer(player.playerId, { energy: 0 });

    await admin.addCard(player.playerId, ECard.BoltsOfDownfall, "hand");
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.hand.some((c: any) => c.name === ECard.BoltsOfDownfall),
    );
    const discardCardId = syncMsg.you.hand.find((c: any) => c.name === ECard.BoltsOfDownfall).cardId;

    const cardId = await ensureCardInHand(player, admin, ECard.RagingTidePlus);

    player.send({ action: "game.useCard", cardId });

    const selectMsg = await player.waitFor((m: any) => m.action === "game.ragingTideSelect");

    player.send({
      action: "game.ragingTideSelectResponse",
      taskId: selectMsg.taskId,
      selectedCards: [discardCardId],
      enemies: [enemy.id],
    });

    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: enemy.id,
        element1: EElement.Hydro,
        element2: EElement.Hydro,
      }),
    );
    const energySteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "energy" && s.delta > 0,
    );
    const totalEnergyGain = energySteps.reduce((sum: number, s: any) => sum + s.delta, 0);
    expect(totalEnergyGain).toBe(6);
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player1, admin, ECard.RagingTidePlus);

    player1.send({ action: "game.useCard", cardId });

    const selectMsg = await player1.waitFor((m: any) => m.action === "game.ragingTideSelect");

    player1.send({
      action: "game.ragingTideSelectResponse",
      taskId: selectMsg.taskId,
      selectedCards: [],
      enemies: [],
    });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.RagingTidePlus);
    expect(response2.card).toBe(ECard.RagingTidePlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
