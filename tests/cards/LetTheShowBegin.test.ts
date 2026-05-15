/**
 * LetTheShowBegin - Накладывает Гидро 1 врагу в вашей зоне. Восстанавливает 1 ОЗ 1 любому игроку.
 * Вы можете потратить 2 энергии, чтобы восстановить 3 ОЗ.
 * Тип: Skill. Стоимость: 1
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

describe("LetTheShowBegin — накладывает Гидро врагу, лечит выбранного игрока", () => {
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

  it("накладывает Гидро, лечит selectedPlayer на 1 ОЗ, списывает 1 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { hp: 5, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LetTheShowBegin);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], selectedPlayer: player.playerId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Hydro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player.playerId,
        amount: 1,
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
        card: expect.objectContaining({ name: ECard.LetTheShowBegin }),
      }),
    );

    expect(response.player.hp).toBe(6);
    expect(response.player.actionPoints.total).toBe(2);
  });

  it("isUseAlternative с 2 энергиями — лечит 3 ОЗ и тратит 2 энергии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { hp: 5, energy: 2, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LetTheShowBegin);

    player.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy.id],
      selectedPlayer: player.playerId,
      isUseAlternative: true,
    });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player.playerId,
        amount: 3,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.playerId,
        delta: -2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Hydro,
      }),
    );

    expect(response.player.hp).toBe(8);
  });

  it("isUseAlternative без энергии — возвращает ошибку", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LetTheShowBegin);

    player.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy.id],
      selectedPlayer: player.playerId,
      isUseAlternative: true,
    });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("лечит другого игрока при selectedPlayer = player2", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });
    await admin.updatePlayer(player2.playerId, { hp: 5 });

    const cardId = await ensureCardInHand(player1, admin, ECard.LetTheShowBegin);

    player1.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy.id],
      selectedPlayer: player2.playerId,
    });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerHeal,
        playerId: player2.playerId,
        amount: 1,
      }),
    );
  });

  it("возвращает ошибку если enemies не переданы", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LetTheShowBegin);

    player.send({ action: "game.useCard", cardId, selectedPlayer: player.playerId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("возвращает ошибку если selectedPlayer не передан", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LetTheShowBegin);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.LetTheShowBegin);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], selectedPlayer: player.playerId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { hp: 5, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.LetTheShowBegin);

    player1.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy.id],
      selectedPlayer: player1.playerId,
    });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.LetTheShowBegin);
    expect(response2.card).toBe(ECard.LetTheShowBegin);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
