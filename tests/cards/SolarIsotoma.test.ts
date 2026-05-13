/**
 * SolarIsotoma — Накладывает Гео всем врагам в вашей зоне. В начале следующего хода накладывает Гео
 * всем врагам. Можно выбросить карту из руки или сброса, чтобы вытянуть карту.
 * Тип: Skill. Стоимость: 2 очка действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { SolarIsotoma } from "../../src/storage/cards/Albedo/SolarIsotoma";
import { SolarIsotomaEffect } from "../../src/storage/effects/SolarIsotomaEffect";
import { WeissBladework } from "../../src/storage/cards/Albedo/WeissBladework";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
import { EDetailedStep, EElement, EPlayerEffect } from "../../src/types/enums";
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

describe("SolarIsotoma — Накладывает Гео всем врагам в зоне, даёт эффект Тектоническая волна. Опционально: выбросить карту и вытянуть", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: SolarIsotoma;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    player.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 }, energy: 0 });
    card = new SolarIsotoma();
    player.addCardToHand(card);
    ws = makeWs(player, cycleController);
  });

  function addEnemy(hp: number): HilichurlGuard {
    const enemy = new HilichurlGuard();
    enemy.adminSetStats({ hp, shield: 0 });
    player.addEnemy(enemy);
    return enemy;
  }

  function getResponse(): GameUseCardResponse {
    return mockedSendToAll.mock.calls[0][0] as GameUseCardResponse;
  }

  it("рассылает шаги: EnemyGetElement → PlayerGetEffect → PlayerStatChange(ap) → MoveCard, эффект добавлен", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const elementIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy.ID,
    );
    const effectIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerGetEffect && s.playerId === player.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(elementIdx).toBeGreaterThanOrEqual(0);
    expect(effectIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(elementIdx).toBeLessThan(effectIdx);
    expect(effectIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[elementIdx]).toEqual({
      type: EDetailedStep.EnemyGetElement,
      enemyId: enemy.ID,
      element: EElement.Geo,
    });
    expect(steps[effectIdx]).toEqual({
      type: EDetailedStep.PlayerGetEffect,
      playerId: player.ID,
      effect: EPlayerEffect.SolarIsotoma,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -2,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(player.isContainsEffect(new SolarIsotomaEffect())).toBe(true);
  });

  it("нет врагов в зоне — EnemyGetElement отсутствует, PlayerGetEffect и стандартные шаги есть", async () => {
    await useCard(ws, { cardId: card.ID });

    const { steps } = getResponse();
    const elementIdx = steps.findIndex((s) => s.type === EDetailedStep.EnemyGetElement);
    const effectIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerGetEffect && s.playerId === player.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(elementIdx).toBe(-1);
    expect(effectIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);

    expect(steps[effectIdx]).toEqual({
      type: EDetailedStep.PlayerGetEffect,
      playerId: player.ID,
      effect: EPlayerEffect.SolarIsotoma,
    });
    expect(steps[apIdx]).toEqual({
      type: EDetailedStep.PlayerStatChange,
      stat: "actionPoints",
      playerId: player.ID,
      delta: -2,
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(player.isContainsEffect(new SolarIsotomaEffect())).toBe(true);
  });

  it("два врага в зоне — EnemyGetElement для каждого в порядке добавления, оба получают Гео", async () => {
    const firstEnemy = addEnemy(5);
    const secondEnemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID });

    const { steps } = getResponse();
    const element1Idx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === firstEnemy.ID,
    );
    const element2Idx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === secondEnemy.ID,
    );
    const effectIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerGetEffect && s.playerId === player.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(element1Idx).toBeGreaterThanOrEqual(0);
    expect(element2Idx).toBeGreaterThanOrEqual(0);
    expect(effectIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(element1Idx).toBeLessThan(element2Idx);
    expect(element2Idx).toBeLessThan(effectIdx);
    expect(effectIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[element1Idx]).toEqual({
      type: EDetailedStep.EnemyGetElement,
      enemyId: firstEnemy.ID,
      element: EElement.Geo,
    });
    expect(steps[element2Idx]).toEqual({
      type: EDetailedStep.EnemyGetElement,
      enemyId: secondEnemy.ID,
      element: EElement.Geo,
    });
  });

  it("selectedCard из руки — MoveCard(trash) + DrawCards идут после PlayerGetEffect", async () => {
    const enemy = addEnemy(5);
    const otherCard = new WeissBladework();
    player.addCardToHand(otherCard);
    const deckCard = new WeissBladework();
    player.addCardToDeck(deckCard);

    await useCard(ws, { cardId: card.ID, selectedCard: otherCard.ID });

    const { steps } = getResponse();
    const drawnCard = deckCard;

    const effectIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.PlayerGetEffect && s.playerId === player.ID,
    );
    const trashIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "trash" && s.playerId === player.ID,
    );
    const drawIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.DrawCards && s.playerId === player.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(effectIdx).toBeGreaterThanOrEqual(0);
    expect(trashIdx).toBeGreaterThanOrEqual(0);
    expect(drawIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(effectIdx).toBeLessThan(trashIdx);
    expect(trashIdx).toBeLessThan(drawIdx);
    expect(drawIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[trashIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "trash",
      playerId: player.ID,
      card: { cardId: otherCard.ID, name: otherCard.Name, type: otherCard.Type },
    });
    expect(steps[drawIdx]).toEqual({
      type: EDetailedStep.DrawCards,
      playerId: player.ID,
      cards: [drawnCard.getPrimitive()],
    });
    expect(steps[discardIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: { cardId: card.ID, name: card.Name, type: card.Type },
    });
    expect(player.Hand.some((c) => c.ID === otherCard.ID)).toBe(false);
  });

  it("selectedCard из сброса — MoveCard(trash) + DrawCards присутствуют, карта вытянута", async () => {
    const otherCard = new WeissBladework();
    player.discardCard(otherCard);
    const deckCard = new WeissBladework();
    player.addCardToDeck(deckCard);

    await useCard(ws, { cardId: card.ID, selectedCard: otherCard.ID });

    const { steps } = getResponse();
    const drawnCard = deckCard;

    const trashIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "trash" && s.playerId === player.ID,
    );
    const drawIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.DrawCards && s.playerId === player.ID,
    );
    const apIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerStatChange &&
        s.stat === "actionPoints" &&
        s.playerId === player.ID,
    );
    const discardIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.MoveCard && s.to === "discard" && s.playerId === player.ID,
    );

    expect(trashIdx).toBeGreaterThanOrEqual(0);
    expect(drawIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(trashIdx).toBeLessThan(drawIdx);

    expect(steps[trashIdx]).toEqual({
      type: EDetailedStep.MoveCard,
      to: "trash",
      playerId: player.ID,
      card: { cardId: otherCard.ID, name: otherCard.Name, type: otherCard.Type },
    });
    expect(steps[drawIdx]).toEqual({
      type: EDetailedStep.DrawCards,
      playerId: player.ID,
      cards: [drawnCard.getPrimitive()],
    });
  });

  it("выбрасывает ошибку, если selectedCard === ID самой карты", async () => {
    await expect(useCard(ws, { cardId: card.ID, selectedCard: card.ID })).rejects.toThrow(
      "card cannot trash itself",
    );
  });

  it("выбрасывает ошибку, если selectedCard не находится в руке или сбросе", async () => {
    const otherCard = new WeissBladework();

    await expect(
      useCard(ws, { cardId: card.ID, selectedCard: otherCard.ID }),
    ).rejects.toThrow("selectedCard must be a card in your hand or discard");
  });
});
