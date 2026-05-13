/**
 * LetTheShowBeginPlus — Накладывает Гидро всем врагам в вашей зоне.
 * На этом ходу: ваши обычные атаки восстанавливают 1 ОЗ 1 случайному игроку.
 * Тип: Skill. Стоимость: 1 очко действия.
 */

import gameHandlers from "../../src/ws/handlers/game";
import { sendToAll } from "../../src/utils/wsUtils";
import { LetTheShowBeginPlus } from "../../src/storage/cards/Barbara/LetTheShowBeginPlus";
import { LetTheShowBeginPlusEffect } from "../../src/storage/effects/LetTheShowBeginPlusEffect";
import { HilichurlGuard } from "../../src/storage/enemies/normal/HilichurlGuard";
import { EDetailedStep, EElement, EPlayerEffect } from "../../src/types/enums";
import { GameUseCardResponse } from "../../src/types/response";
import { createGameState, makeWs } from "../helpers/setup";
import { getAllPlayers } from "../../src/ws";
import { CycleController } from "../../src/game/CycleController";
import { Player } from "../../src/game/Player";
import { ExtWebSocket } from "../../src/types/wsTypes";
import { DetailedStep } from "../../src/types/detailedStep";

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

describe("LetTheShowBeginPlus — Накладывает Гидро всем врагам в зоне, атаки лечат случайного игрока", () => {
  let cycleController: CycleController;
  let player: Player;
  let card: LetTheShowBeginPlus;
  let ws: ExtWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ cycleController, player } = createGameState());
    player.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 } });
    card = new LetTheShowBeginPlus();
    player.addCardToHand(card);
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

  it("один враг в зоне: EnemyGetElement(Hydro) → PlayerGetEffect → PlayerStatChange(ap) → MoveCard, Гидро наложен, эффект добавлен", async () => {
    const enemy = addEnemy(5);

    await useCard(ws, { cardId: card.ID });

    expect(mockedSendToAll).toHaveBeenCalledTimes(1);
    const { action, steps } = getResponse();
    expect(action).toBe("game.useCard");

    const elementIdx = steps.findIndex(
      (s) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy.ID,
    );
    const effectIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerGetEffect &&
        s.playerId === player.ID &&
        s.effect === EPlayerEffect.LetTheShowBeginPlus,
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
    expect(effectIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
    expect(elementIdx).toBeLessThan(effectIdx);
    expect(effectIdx).toBeLessThan(apIdx);
    expect(apIdx).toBeLessThan(discardIdx);

    expect(steps[elementIdx]).toEqual({
      type: EDetailedStep.EnemyGetElement,
      enemyId: enemy.ID,
      element: EElement.Hydro,
    });
    expect(steps[effectIdx]).toEqual({
      type: EDetailedStep.PlayerGetEffect,
      playerId: player.ID,
      effect: EPlayerEffect.LetTheShowBeginPlus,
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
    expect(player.isContainsEffect(new LetTheShowBeginPlusEffect())).toBe(true);
  });

  it("два врага в зоне — оба получают EnemyGetElement(Hydro), оба с Гидро", async () => {
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
      (s) =>
        s.type === EDetailedStep.PlayerGetEffect &&
        s.playerId === player.ID &&
        s.effect === EPlayerEffect.LetTheShowBeginPlus,
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
      element: EElement.Hydro,
    });
    expect(steps[element2Idx]).toEqual({
      type: EDetailedStep.EnemyGetElement,
      enemyId: secondEnemy.ID,
      element: EElement.Hydro,
    });
  });

  it("нет врагов в зоне — EnemyGetElement отсутствует, PlayerGetEffect и стандартные шаги присутствуют", async () => {
    await useCard(ws, { cardId: card.ID });

    const { steps } = getResponse();

    const elementIdx = steps.findIndex((s) => s.type === EDetailedStep.EnemyGetElement);
    const effectIdx = steps.findIndex(
      (s) =>
        s.type === EDetailedStep.PlayerGetEffect &&
        s.playerId === player.ID &&
        s.effect === EPlayerEffect.LetTheShowBeginPlus,
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

    expect(elementIdx).toBe(-1);
    expect(effectIdx).toBeGreaterThanOrEqual(0);
    expect(apIdx).toBeGreaterThanOrEqual(0);
    expect(discardIdx).toBeGreaterThanOrEqual(0);
  });

  describe("эффект LetTheShowBeginPlusEffect", () => {
    function triggerOnAttack(): DetailedStep[] {
      jest.mocked(getAllPlayers).mockReturnValueOnce([player]);

      const steps: DetailedStep[] = [];
      player.setStepsCollector((data) => steps.push(...data));
      const effect = new LetTheShowBeginPlusEffect();
      const enemy = new HilichurlGuard();
      effect.onAttack(player, enemy);
      player.setStepsCollector(null);
      return steps;
    }

    it("onStartCycle возвращает true — эффект истекает в начале нового хода", () => {
      const effect = new LetTheShowBeginPlusEffect();
      expect(effect.onStartCycle(player)).toBe(true);
    });

    it("onAttack восстанавливает 1 ОЗ случайному игроку и генерирует PlayerHeal", () => {
      player.adminSetStats({ hp: 10, actionPoints: { normal: 3, extra: 0 } });

      const steps = triggerOnAttack();

      const healIdx = steps.findIndex(
        (s) => s.type === EDetailedStep.PlayerHeal && s.playerId === player.ID,
      );
      expect(healIdx).toBeGreaterThanOrEqual(0);
      expect(steps[healIdx]).toEqual({
        type: EDetailedStep.PlayerHeal,
        playerId: player.ID,
        amount: 1,
      });
      expect(player.Health).toBe(11);
    });

    it("onAttack возвращает false — эффект не снимается после атаки", () => {
      jest.mocked(getAllPlayers).mockReturnValueOnce([player]);
      const effect = new LetTheShowBeginPlusEffect();
      const enemy = new HilichurlGuard();
      expect(effect.onAttack(player, enemy)).toBe(false);
    });
  });
});
