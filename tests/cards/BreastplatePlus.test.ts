/**
 * BreastplatePlus - Накладывает Гео всем врагам в вашей зоне. На этом ходу ваши обычные атаки
 * восстанавливают 1 ОЗ 1 любому игроку.
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from "@jest/globals";
import { ECard, EDetailedStep, EElement, EEnemy, EPlayerEffect } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  spawnTestBoss,
  endTurn,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("BreastplatePlus — накладывает Гео на всех врагов, даёт эффект лечения при атаке", () => {
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

  it("накладывает Гео на врага, добавляет эффект Breastplate и стандартные шаги", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.BreastplatePlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy.id, element: EElement.Geo }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.Breastplate,
      }),
    );
    expect(
      response.steps.filter(
        (s: any) => s.type === EDetailedStep.PlayerGetEffect && s.effect === EPlayerEffect.Breastplate,
      ),
    ).toHaveLength(1);
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
        card: expect.objectContaining({ name: ECard.BreastplatePlus }),
      }),
    );
    expect(response.player.effects).toContain(EPlayerEffect.Breastplate);
  });

  it("накладывает Гео на босса в сессии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
    await admin.updateBoss({ hp: 20, shield: 0, elements: [] });
    await admin.updateEnemy(player.enemies[0].id, { elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.BreastplatePlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: bossId, element: EElement.Geo }),
    );
  });

  it("эффект Breastplate генерирует PlayerHeal шаг при атаке", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { hp: 6 });
    await admin.updateEnemy(player.enemies[0].id, { hp: 20, shield: 0, elements: [] });

    await admin.request({
      action: "admin.setState",
      players: [{ playerId: player.playerId, effects: [EPlayerEffect.Breastplate] }],
    });
    await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.effects?.includes(EPlayerEffect.Breastplate),
    );

    const cardId = await ensureCardInHand(player, admin, ECard.StarfellSword);
    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerHeal, playerId: player.playerId, amount: 1 }),
    );
    expect(response.player.hp).toBe(7);
  });

  it("два эффекта Breastplate лечат дважды при атаке", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { hp: 6 });
    await admin.updateEnemy(player.enemies[0].id, { hp: 20, shield: 0, elements: [] });

    await admin.request({
      action: "admin.setState",
      players: [{ playerId: player.playerId, effects: [EPlayerEffect.Breastplate, EPlayerEffect.Breastplate] }],
    });
    await player.waitFor((m: any) => m.action === "admin.stateSync" && m.you.effects?.length >= 2);

    const cardId = await ensureCardInHand(player, admin, ECard.StarfellSword);
    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const healSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerHeal && s.playerId === player.playerId,
    );
    expect(healSteps).toHaveLength(2);
    expect(response.player.hp).toBe(8);
    expect(response.player.effects.filter((e: any) => e === EPlayerEffect.Breastplate)).toHaveLength(2);
  });

  it("эффект Breastplate снимается в начале следующего цикла", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.BreastplatePlus);
    player.send({ action: "game.useCard", cardId });
    await player.waitFor((m: any) => m.action === "game.useCard");

    await admin.setLeylines([]);
    const cycle2 = await endTurn(player);

    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerEffectTrigger,
        playerId: player.playerId,
        effect: EPlayerEffect.Breastplate,
        isRemove: true,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerLoseEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.Breastplate,
      }),
    );
    expect(cycle2.you.effects).not.toContain(EPlayerEffect.Breastplate);
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player1.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    const cardId = await ensureCardInHand(player1, admin, ECard.BreastplatePlus);

    player1.send({ action: "game.useCard", cardId });
    const [res1, res2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(res1.player.playerId).toBe(player1.playerId);
    expect(res2.player.playerId).toBe(player1.playerId);
    expect(res1.card).toBe(ECard.BreastplatePlus);
    expect(res2.card).toBe(ECard.BreastplatePlus);
  });
});
