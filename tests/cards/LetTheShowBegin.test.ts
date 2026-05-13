/**
 * LetTheShowBegin — Накладывает Гидро 1 врагу в вашей зоне. Восстанавливает 1 ОЗ 1 любому игроку.
 * Вы можете потратить 2 энергии, чтобы восстановить 3 ОЗ.
 * Тип: Skill. Стоимость: 1 очко действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { LetTheShowBegin } from "../../src/storage/cards/Barbara/LetTheShowBegin";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
import { EDetailedStep, EElement } from "../../src/types/enums";
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

describe("LetTheShowBegin — Накладывает Гидро 1 врагу в зоне, восстанавливает ОЗ (1 или 3 с энергией)", () => {
  let cycleController: CycleController;
  let player: Player;
  let otherPlayer: Player;
  let card: LetTheShowBegin;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    player.adminSetStats({ hp: 8, actionPoints: { normal: 3, extra: 0 }, energy: 5 });
    card = new LetTheShowBegin();
    player.addCardToHand(card);

    ({ player: otherPlayer } = createGameState());
    otherPlayer.adminSetStats({ hp: 8, actionPoints: { normal: 3, extra: 0 } });
    cycleController.connectPlayer(otherPlayer);

    ws = makeWs(player, cycleController);
  });

  function addEnemy(hp: number): HilichurlGuard {
    const enemy = new HilichurlGuard();
    enemy.adminSetStats({ hp });
    player.addEnemy(enemy);
    return enemy;
  }

  function getResponse(): GameUseCardResponse {
    return mockedSendToAll.mock.calls[0][0] as GameUseCardResponse;
  }

  it("стандартное лечение: EnemyGetElement(Hydro) → PlayerHeal(1) → PlayerStatChange(ap) → MoveCard", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID], selectedPlayer: otherPlayer.ID });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const elementIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy.ID,
    );
    const healIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerHeal && s.playerId === otherPlayer.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(elementIdx).toBeGreaterThanOrEqual(0);
    expect(healIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(elementIdx).toBeLessThan(healIdx);
    expect(healIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[elementIdx]).toEqual({
      type: EDetailedStep.EnemyGetElement,
      enemyId: enemy.ID,
      element: EElement.Hydro,
    });
    expect(steps[healIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: otherPlayer.ID,
      amount: 1,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -1,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(otherPlayer.Health).toBe(9);
  });

  it("альтернативный режим с энергией: EnemyGetElement → PlayerStatChange(energy, -2) → PlayerHeal(3) → ap → MoveCard", async () => {
    const enemy = addEnemy(5);
    player.adminSetStats({ hp: 8, actionPoints: { normal: 3, extra: 0 }, energy: 2 });

    await useCard(ws, {
      cardId: card.ID,
      enemies: [enemy.ID],
      selectedPlayer: otherPlayer.ID,
      isUseAlternative: true,
    });

    const { steps } = getResponse();

    const elementIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy.ID,
    );
    const energyIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "energy" &&
        s.playerId === player.ID,
    );
    const healIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerHeal && s.playerId === otherPlayer.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(elementIdx).toBeGreaterThanOrEqual(0);
    expect(energyIdx).toBeGreaterThanOrEqual(0);
    expect(healIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(elementIdx).toBeLessThan(energyIdx);
    expect(energyIdx).toBeLessThan(healIdx);
    expect(healIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[energyIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "energy",
      playerId: player.ID,
      delta: -2,
    });
    expect(steps[healIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: otherPlayer.ID,
      amount: 3,
    });
    expect(otherPlayer.Health).toBe(11);
    expect(player.Energy).toBe(0);
  });

  it("альтернативный режим без энергии — лечит на 1, PlayerStatChange(energy) отсутствует", async () => {
    const enemy = addEnemy(5);
    player.adminSetStats({ hp: 8, actionPoints: { normal: 3, extra: 0 }, energy: 0 });

    await useCard(ws, {
      cardId: card.ID,
      enemies: [enemy.ID],
      selectedPlayer: otherPlayer.ID,
      isUseAlternative: true,
    });

    const { steps } = getResponse();

    const energyIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "energy" &&
        s.playerId === player.ID,
    );
    const healIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerHeal && s.playerId === otherPlayer.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(energyIdx).toBe(-1);
    expect(healIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[healIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: otherPlayer.ID,
      amount: 1,
    });
    expect(otherPlayer.Health).toBe(9);
  });

  it("isUseAlternative: false с энергией — лечит на 1, энергия не тратится", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, {
      cardId: card.ID,
      enemies: [enemy.ID],
      selectedPlayer: otherPlayer.ID,
      isUseAlternative: false,
    });

    const { steps } = getResponse();

    const energyIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "energy" &&
        s.playerId === player.ID,
    );
    const healIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerHeal && s.playerId === otherPlayer.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(energyIdx).toBe(-1);
    expect(healIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[healIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: otherPlayer.ID,
      amount: 1,
    });
    expect(otherPlayer.Health).toBe(9);
    expect(player.Energy).toBe(5);
  });

  it("selectedPlayer — сам игрок: лечится сам, PlayerHeal с player.ID", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID, enemies: [enemy.ID], selectedPlayer: player.ID });

    const { steps } = getResponse();

    const healIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerHeal && s.playerId === player.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(healIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[healIdx]).toEqual({
      type: EDetailedStep.PlayerHeal,
      playerId: player.ID,
      amount: 1,
    });
    expect(player.Health).toBe(9);
  });

  it("выбрасывает ошибку, если поле enemies не передано в запросе", async () => {
    await expect(
      useCard(ws, { cardId: card.ID, selectedPlayer: otherPlayer.ID }),
    ).rejects.toThrow("no enemies");
  });

  it("выбрасывает ошибку, если передан пустой список врагов", async () => {
    await expect(
      useCard(ws, { cardId: card.ID, enemies: [], selectedPlayer: otherPlayer.ID }),
    ).rejects.toThrow("no enemies");
  });

  it("выбрасывает ошибку, если selectedPlayer не передан", async () => {
    const enemy = addEnemy(5);

    await expect(useCard(ws, { cardId: card.ID, enemies: [enemy.ID] })).rejects.toThrow(
      "no selected player",
    );
  });
});
