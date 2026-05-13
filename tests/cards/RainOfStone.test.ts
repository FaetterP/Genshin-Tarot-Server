/**
 * RainOfStone — Наносит 1 пронзающий урон 1 врагу в вашей зоне.
 * Вы можете потратить 1 энергию, чтобы нанести 1 пронзающий урон 1 другому врагу где угодно.
 * Тип: Attack. Стоимость: 0 очков действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { RainOfStone } from "../../src/storage/cards/ZhongLi/RainOfStone";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
import { EDetailedStep } from "../../src/types/enums";
import { GameUseCardResponse } from "../../src/types/response";
import { createGameState, makeWs } from "../helpers/setup";
import { CycleController } from "../../src/game/CycleController";
import { Player } from "../../src/game/Player";
import { ExtWebSocket } from "../../src/types/wsTypes";

jest.mock("../../src/utils/wsUtils", () => ({
  sendToAll: jest.fn(),
  sendToAllAndWait: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../src/ws", () => ({
  getAllClients: jest.fn(() => []),
  getAllPlayers: jest.fn(() => []),
  sendResponseToAdmin: jest.fn(),
  sendStateToClients: jest.fn(),
  getGameStateSnapshot: jest.fn(() => ({})),
  cycleController: null,
  startGameWSS: jest.fn(),
  stopGameWSS: jest.fn(),
  startAdminWSS: jest.fn(),
  stopAdminWSS: jest.fn(),
}));

const mockedSendToAll = sendToAll as jest.MockedFunction<typeof sendToAll>;
const useCard = gameHandlers.handlers.useCard;

describe("RainOfStone — Наносит 1 пронзающий урон 1 врагу в вашей зоне", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: RainOfStone;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    player.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 }, energy: 0 });
    card = new RainOfStone();
    player.addCardToHand(card);
    ws = makeWs(player, cycleController);
  });

  function addEnemy(hp: number, shield = 0): HilichurlGuard {
    const enemy = new HilichurlGuard();
    enemy.adminSetStats({ hp, shield });
    player.addEnemy(enemy);
    return enemy;
  }

  function getResponse(): GameUseCardResponse {
    return mockedSendToAll.mock.calls[0][0] as GameUseCardResponse;
  }

  it("рассылает шаги всем игрокам: EnemyTakeDamage → PlayerChangeActionPoints → DiscardCard", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -0,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(enemy.Health).toBe(4);
  });

  it("враг погибает при оставшихся ровно 1 HP — EnemyTakeDamage идёт перед EnemyDeath", async () => {
    const enemy = addEnemy(1);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const deathIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyDeath && s.enemyId === enemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(deathIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(damageIdx).toBeLessThan(deathIdx);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(enemy.Health).toBe(0);
  });

  it("isUseAlternative без энергии — только первый враг получает урон", async () => {
    const firstEnemy = addEnemy(5);
    const secondEnemy = addEnemy(5);

    await useCard(ws, {
      cardId: card.ID,
      enemies: [firstEnemy.ID, secondEnemy.ID],
      isUseAlternative: true,
    });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === firstEnemy.ID,
    );
    const secondDamageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === secondEnemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(secondDamageIdx).toBe(-1);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: firstEnemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(firstEnemy.Health).toBe(4);
    expect(secondEnemy.Health).toBe(5);
  });

  it("isUseAlternative с энергией — оба врага получают по 1 пронзающему урону", async () => {
    player.adminSetStats({ energy: 1 });
    const firstEnemy = addEnemy(5);
    const secondEnemy = addEnemy(5);

    await useCard(ws, {
      cardId: card.ID,
      enemies: [firstEnemy.ID, secondEnemy.ID],
      isUseAlternative: true,
    });

    const { steps } = getResponse();
    const firstDamageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === firstEnemy.ID,
    );
    const secondDamageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === secondEnemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(firstDamageIdx).toBeGreaterThanOrEqual(0);
    expect(secondDamageIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(firstDamageIdx).toBeLessThan(secondDamageIdx);
    expect(secondDamageIdx).toBeLessThan(apIdx);

    expect(steps[firstDamageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: firstEnemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(steps[secondDamageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: secondEnemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -0,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(firstEnemy.Health).toBe(4);
    expect(secondEnemy.Health).toBe(4);
  });

  it("isUseAlternative с энергией — второй враг погибает: EnemyTakeDamage перед EnemyDeath", async () => {
    player.adminSetStats({ energy: 1 });
    const firstEnemy = addEnemy(5);
    const secondEnemy = addEnemy(1);

    await useCard(ws, {
      cardId: card.ID,
      enemies: [firstEnemy.ID, secondEnemy.ID],
      isUseAlternative: true,
    });

    const { steps } = getResponse();
    const secondDamageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === secondEnemy.ID,
    );
    const secondDeathIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyDeath && s.enemyId === secondEnemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(secondDamageIdx).toBeGreaterThanOrEqual(0);
    expect(secondDeathIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(secondDamageIdx).toBeLessThan(secondDeathIdx);

    expect(steps[secondDamageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: secondEnemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(secondEnemy.Health).toBe(0);
    expect(firstEnemy.Health).toBe(4);
  });

  it("выбрасывает ошибку, если поле enemies не передано", async () => {
    addEnemy(5);

    await expect(useCard(ws, { cardId: card.ID })).rejects.toThrow("no enemies");
  });

  it("выбрасывает ошибку, если передан пустой список врагов", async () => {
    addEnemy(5);

    await expect(useCard(ws, { cardId: card.ID, enemies: [] })).rejects.toThrow("no enemies");
  });

  it("isUseAlternative с энергией, но только 1 враг — выбрасывает ошибку", async () => {
    player.adminSetStats({ energy: 1 });
    const enemy = addEnemy(5);

    await expect(
      useCard(ws, { cardId: card.ID, enemies: [enemy.ID], isUseAlternative: true }),
    ).rejects.toThrow("need 2 enemies");
  });

  it("isUseAlternative с энергией, одинаковый враг дважды — выбрасывает ошибку", async () => {
    player.adminSetStats({ energy: 1 });
    const enemy = addEnemy(5);

    await expect(
      useCard(ws, { cardId: card.ID, enemies: [enemy.ID, enemy.ID], isUseAlternative: true }),
    ).rejects.toThrow("need 2 different enemies");
  });

  it("isUseAlternative без энергии, только 1 враг — наносит удар по нему как обычно", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, {
      cardId: card.ID,
      enemies: [enemy.ID],
      isUseAlternative: true,
    });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -0,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(enemy.Health).toBe(4);
  });

  it("пронзающий урон игнорирует щит врага — EnemyBlockDamage отсутствует, HP уменьшается", async () => {
    const enemy = addEnemy(5, 1);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID] });

    const { steps } = getResponse();
    const damageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.ID,
    );
    const blockIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyBlockDamage && s.enemyId === enemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(blockIdx).toBe(-1);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[damageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: enemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(enemy.Health).toBe(4);
  });

  it("isUseAlternative с энергией — второй удар дальний, бьёт врага другого игрока", async () => {
    player.adminSetStats({ energy: 1 });
    const firstEnemy = addEnemy(5);

    const player2 = new Player(cycleController);
    cycleController.connectPlayer(player2);
    player2.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 } });
    const secondEnemy = new HilichurlGuard();
    secondEnemy.adminSetStats({ hp: 5 });
    player2.addEnemy(secondEnemy);

    await useCard(ws, {
      cardId: card.ID,
      enemies: [firstEnemy.ID, secondEnemy.ID],
      isUseAlternative: true,
    });

    const { steps } = getResponse();
    const firstDamageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === firstEnemy.ID,
    );
    const secondDamageIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === secondEnemy.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard &&
        s.to === "discard" &&
        s.playerId === player.ID,
    );

    expect(firstDamageIdx).toBeGreaterThanOrEqual(0);
    expect(secondDamageIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[secondDamageIdx]).toEqual({
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: secondEnemy.ID,
      damage: 1,
      isPiercing: true,
    });
    expect(firstEnemy.Health).toBe(4);
    expect(secondEnemy.Health).toBe(4);
  });
});
