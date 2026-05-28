/**
 * Dvalin - финальный босс.
 * Жизни/HP/щит масштабируются с числом игроков:
 *   1P: 2 жизни, 15 HP, 2 щита
 *   2P: 3 жизни, 15 HP, 2 щита
 *   3P: 4 жизни, 16 HP, 3 щита
 *   4P: 5 жизней, 18 HP, 3 щита
 *
 * Пассивка на старте каждого цикла: сброс 2 Attack/Skill карт или -1 AP.
 * Атаки (d6 в конце цикла):
 *   1-3: Swooping Strike — 4 не-пронзающего урона всем игрокам
 *   4-5: Pulsing Wind — 3 не-пронзающего урона + сброс 2 случайных карт у каждого
 *   6:   Dragon's Breath — 4 пронзающего урона, уклонение: трэш Dash или сброс 4 карт
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EEnemy } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  spawnTestBoss,
  ensureCardInHand,
  TestGame,
  GameTestClient,
  AdminTestClient,
} from "../helpers/setup";

jest.setTimeout(15000);

let game: TestGame | undefined;

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
  game = undefined;
});

async function endTurnWithBoss(
  player: GameTestClient,
): Promise<{ endCycle: any; startCycle: any }> {
  player.send({ action: "game.endTurn" });
  const [endCycle, startCycle] = await Promise.all([
    player.waitFor((m: any) => m.action === "game.endCycle"),
    player.waitFor((m: any) => m.action === "game.startCycle"),
  ]);
  player.startCycleData = startCycle;
  return { endCycle, startCycle };
}


async function removePlayerEnemies(
  player: GameTestClient,
  admin: AdminTestClient,
): Promise<void> {
  const enemies = player.enemies;
  for (const enemy of enemies) {
    await admin.removeEnemy(enemy.id);
  }
  if (enemies.length > 0) {
    await player.waitFor((m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length === 0);
  }
}


describe("Dvalin - финальный босс", () => {
  describe("Спавн босса", () => {
    it("1 игрок: 15 HP, 2 щита, 2 жизни", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await admin.spawnBoss(EEnemy.Dvalin);
      const syncMsg = await player.waitFor(
        (m: any) => m.action === "admin.stateSync" && m.boss !== null,
      );
      expect(syncMsg.boss.name).toBe("Dvalin");
      expect(syncMsg.boss.hp).toBe(15);
      expect(syncMsg.boss.shield).toBe(2);
      expect(syncMsg.boss.lives).toBe(2);
    });

    it("2 игрока: 15 HP, 2 щита, 3 жизни", async () => {
      game = await createTestGame(2);
      const {
        players: [player],
        admin,
      } = game;
      await admin.spawnBoss(EEnemy.Dvalin);
      const syncMsg = await player.waitFor(
        (m: any) => m.action === "admin.stateSync" && m.boss !== null,
      );
      expect(syncMsg.boss.hp).toBe(15);
      expect(syncMsg.boss.shield).toBe(2);
      expect(syncMsg.boss.lives).toBe(3);
    });

    it("3 игрока: 16 HP, 3 щита, 4 жизни", async () => {
      game = await createTestGame(3);
      const {
        players: [player],
        admin,
      } = game;
      await admin.spawnBoss(EEnemy.Dvalin);
      const syncMsg = await player.waitFor(
        (m: any) => m.action === "admin.stateSync" && m.boss !== null,
      );
      expect(syncMsg.boss.hp).toBe(16);
      expect(syncMsg.boss.shield).toBe(3);
      expect(syncMsg.boss.lives).toBe(4);
    });

    it("4 игрока: 18 HP, 3 щита, 5 жизней", async () => {
      game = await createTestGame(4);
      const {
        players: [player],
        admin,
      } = game;
      await admin.spawnBoss(EEnemy.Dvalin);
      const syncMsg = await player.waitFor(
        (m: any) => m.action === "admin.stateSync" && m.boss !== null,
      );
      expect(syncMsg.boss.hp).toBe(18);
      expect(syncMsg.boss.shield).toBe(3);
      expect(syncMsg.boss.lives).toBe(5);
    });

    it("нельзя заспавнить босса дважды — второй спавн не создаёт нового", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.spawnBoss(EEnemy.Dvalin);
      const syncMsg = await player.waitFor((m: any) => m.action === "admin.stateSync");
      expect(syncMsg.boss?.id).toBe(bossId);
    });
  });

  describe("Анемо-иммунитет", () => {
    it("Анемо-элемент блокируется: шаг BossAnemoImmunity, элемент не применяется", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.updateBoss({ elements: [] });
      const cardId = await ensureCardInHand(player, admin, ECard.Chihayaburu);

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      const response = await player.waitFor((m: any) => m.action === "game.useCard");

      expect(response.steps).toContainEqual(
        expect.objectContaining({ type: EDetailedStep.BossAnemoImmunity, bossId }),
      );
      expect(response.boss.elements).not.toContain(EElement.Anemo);
    });

    it("не-Анемо элемент (Pyro) применяется нормально, BossAnemoImmunity нет", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.updateBoss({ elements: [], hp: 15, shield: 0 });
      await admin.updatePlayer(player.playerId, { energy: 1 });
      const cardId = await ensureCardInHand(player, admin, ECard.Sharpshooter);

      player.send({ action: "game.useCard", cardId, enemies: [bossId], isUseAlternative: true });
      const response = await player.waitFor((m: any) => m.action === "game.useCard");

      expect(response.boss.elements).toContain(EElement.Pyro);
      expect(response.steps).not.toContainEqual(
        expect.objectContaining({ type: EDetailedStep.BossAnemoImmunity }),
      );
    });
  });

  describe("Пассивка босса (начало каждого цикла)", () => {
    it("сброс 2 Attack-карт: потеря AP отменяется, 2 MoveCard в startCycle.steps", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      let discardedIds: string[] = [];
      player.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const attackCards = msg.hand
          .filter((c: any) => c.type === "Attack")
          .slice(0, 2);
        discardedIds = attackCards.map((c: any) => c.cardId);
        player.send({
          action: "game.bossPassiveResponse",
          taskId,
          type: "discard",
          cardIds: discardedIds,
        });
      });
      const { startCycle } = await endTurnWithBoss(player);

      expect(discardedIds).toHaveLength(2);
      const discardSteps = startCycle.steps.filter(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          discardedIds.includes(s.card?.cardId),
      );
      expect(discardSteps).toHaveLength(2);
      expect(startCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          delta: -1,
        }),
      );
    });

    it("сброс 2 Skill-карт: потеря AP отменяется", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      let discardedIds: string[] = [];
      player.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const skillCards = msg.hand
          .filter((c: any) => c.type === "Skill")
          .slice(0, 2);
        discardedIds = skillCards.map((c: any) => c.cardId);
        player.send({
          action: "game.bossPassiveResponse",
          taskId,
          type: "discard",
          cardIds: discardedIds,
        });
      });
      const { startCycle } = await endTurnWithBoss(player);

      expect(discardedIds).toHaveLength(2);
      const discardSteps = startCycle.steps.filter(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          discardedIds.includes(s.card?.cardId),
      );
      expect(discardSteps).toHaveLength(2);
      expect(startCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          delta: -1,
        }),
      );
    });

    it("сброс Attack + Skill: потеря AP отменяется", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      let discardedIds: string[] = [];
      player.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const attackCard = msg.hand.find((c: any) => c.type === "Attack");
        const skillCard = msg.hand.find((c: any) => c.type === "Skill");
        if (attackCard && skillCard) {
          discardedIds = [attackCard.cardId, skillCard.cardId];
        } else {
          const anyValid = msg.hand
            .filter((c: any) => c.type === "Attack" || c.type === "Skill")
            .slice(0, 2);
          discardedIds = anyValid.map((c: any) => c.cardId);
        }
        player.send({
          action: "game.bossPassiveResponse",
          taskId,
          type: "discard",
          cardIds: discardedIds,
        });
      });
      const { startCycle } = await endTurnWithBoss(player);

      expect(discardedIds).toHaveLength(2);
      expect(startCycle.steps.filter(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          discardedIds.includes(s.card?.cardId),
      )).toHaveLength(2);
      expect(startCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          delta: -1,
        }),
      );
    });

    it("явный type: loseAP — игрок теряет 1 AP", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      player.setTaskHandler("game.bossPassive", (taskId) => {
        player.send({ action: "game.bossPassiveResponse", taskId, type: "loseAP" });
      });
      const { startCycle } = await endTurnWithBoss(player);

      expect(startCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: player.playerId,
          delta: -1,
        }),
      );
    });

    it("Other-тип карт (Dash) не засчитываются — игрок теряет AP", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      player.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const otherCards = msg.hand.filter((c: any) => c.type === "Other").slice(0, 2);
        const cardIds =
          otherCards.length >= 2
            ? otherCards.map((c: any) => c.cardId)
            : ["fake-id-1", "fake-id-2"];
        player.send({
          action: "game.bossPassiveResponse",
          taskId,
          type: "discard",
          cardIds,
        });
      });
      const { startCycle } = await endTurnWithBoss(player);

      expect(startCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          delta: -1,
        }),
      );
    });

    it("передан только 1 cardId — потеря AP", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      player.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const validCard = msg.hand.find((c: any) => c.type === "Attack" || c.type === "Skill");
        player.send({
          action: "game.bossPassiveResponse",
          taskId,
          type: "discard",
          cardIds: validCard ? [validCard.cardId] : [],
        });
      });
      const { startCycle } = await endTurnWithBoss(player);

      expect(startCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          delta: -1,
        }),
      );
    });

    it("шаги пассивки — в game.startCycle, а не в game.endCycle", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      let discardedIds: string[] = [];
      player.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const validCards = msg.hand
          .filter((c: any) => c.type === "Attack" || c.type === "Skill")
          .slice(0, 2);
        discardedIds = validCards.map((c: any) => c.cardId);
        player.send({
          action: "game.bossPassiveResponse",
          taskId,
          type: "discard",
          cardIds: discardedIds,
        });
      });
      const { endCycle, startCycle } = await endTurnWithBoss(player);

      expect(discardedIds).toHaveLength(2);

      const isPassiveMove = (s: any) =>
        s.type === EDetailedStep.MoveCard && discardedIds.includes(s.card?.cardId);

      expect(startCycle.steps.filter(isPassiveMove)).toHaveLength(2);
      expect(endCycle.steps.filter(isPassiveMove)).toHaveLength(0);
    });

    it("2 игрока: оба сбрасывают 2 карты — ни один не теряет AP", async () => {
      game = await createTestGame(2);
      const {
        players: [player1, player2],
        admin,
      } = game;
      await spawnTestBoss(player1, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player1, admin);
      await removePlayerEnemies(player2, admin);
      await admin.setBossRoll(1);

      let p1DiscardedIds: string[] = [];
      let p2DiscardedIds: string[] = [];

      player1.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const validCards = msg.hand
          .filter((c: any) => c.type === "Attack" || c.type === "Skill")
          .slice(0, 2);
        p1DiscardedIds = validCards.map((c: any) => c.cardId);
        player1.send({ action: "game.bossPassiveResponse", taskId, type: "discard", cardIds: p1DiscardedIds });
      });
      player2.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const validCards = msg.hand
          .filter((c: any) => c.type === "Attack" || c.type === "Skill")
          .slice(0, 2);
        p2DiscardedIds = validCards.map((c: any) => c.cardId);
        player2.send({ action: "game.bossPassiveResponse", taskId, type: "discard", cardIds: p2DiscardedIds });
      });

      for (const p of [player1, player2]) p.send({ action: "game.endTurn" });
      const startCycle = await player1.waitFor((m: any) => m.action === "game.startCycle");
      await player2.waitFor((m: any) => m.action === "game.startCycle");

      expect(p1DiscardedIds).toHaveLength(2);
      expect(p2DiscardedIds).toHaveLength(2);
      expect(startCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: player1.playerId,
          delta: -1,
        }),
      );
      expect(startCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: player2.playerId,
          delta: -1,
        }),
      );
      expect(
        startCycle.steps.filter(
          (s: any) =>
            s.type === EDetailedStep.MoveCard &&
            s.to === "discard" &&
            p1DiscardedIds.includes(s.card?.cardId),
        ),
      ).toHaveLength(2);
      expect(
        startCycle.steps.filter(
          (s: any) =>
            s.type === EDetailedStep.MoveCard &&
            s.to === "discard" &&
            p2DiscardedIds.includes(s.card?.cardId),
        ),
      ).toHaveLength(2);
    });

    it("2 игрока: один сбрасывает карты, другой теряет 1 AP", async () => {
      game = await createTestGame(2);
      const {
        players: [player1, player2],
        admin,
      } = game;
      await spawnTestBoss(player1, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player1, admin);
      await removePlayerEnemies(player2, admin);
      await admin.setBossRoll(1);

      let p1DiscardedIds: string[] = [];
      player1.setTaskHandler("game.bossPassive", (taskId, msg) => {
        const validCards = msg.hand
          .filter((c: any) => c.type === "Attack" || c.type === "Skill")
          .slice(0, 2);
        p1DiscardedIds = validCards.map((c: any) => c.cardId);
        player1.send({ action: "game.bossPassiveResponse", taskId, type: "discard", cardIds: p1DiscardedIds });
      });
      player2.setTaskHandler("game.bossPassive", (taskId) => {
        player2.send({ action: "game.bossPassiveResponse", taskId, type: "loseAP" });
      });

      for (const p of [player1, player2]) p.send({ action: "game.endTurn" });
      const startCycle = await player1.waitFor((m: any) => m.action === "game.startCycle");
      await player2.waitFor((m: any) => m.action === "game.startCycle");

      expect(startCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: player1.playerId,
          delta: -1,
        }),
      );
      expect(startCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: player2.playerId,
          delta: -1,
        }),
      );
    });
  });

  describe("Swooping Strike (бросок 1–3): 4 не-пронзающего урона всем", () => {
    it("урон игроку без щита: PlayerTakeDamage(4, isPiercing=false) + EnemyAttack", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 0, hp: 15 });
      await admin.setBossRoll(1);

      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 4,
          isPiercing: false,
          enemyId: bossId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player.playerId,
          damage: 4,
        }),
      );
    });

    it("щит частично поглощает урон: PlayerStatChange(shield) + PlayerTakeDamage с остатком", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 2, hp: 15 });
      await admin.setBossRoll(2);

      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "shield",
          playerId: player.playerId,
          delta: -2,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 2,
          isPiercing: false,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          damage: 4,
        }),
      );
    });

    it("щит полностью блокирует урон: PlayerStatChange, нет PlayerTakeDamage", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 5, hp: 15 });
      await admin.setBossRoll(3);

      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "shield",
          playerId: player.playerId,
          delta: -4,
        }),
      );
      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          damage: 4,
        }),
      );
    });

    it("2 игрока: оба получают PlayerTakeDamage и EnemyAttack", async () => {
      game = await createTestGame(2);
      const {
        players: [player1, player2],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player1, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player1, admin);
      await removePlayerEnemies(player2, admin);
      await admin.updatePlayer(player1.playerId, { shield: 0, hp: 15 });
      await admin.updatePlayer(player2.playerId, { shield: 0, hp: 15 });
      await admin.setBossRoll(1);

      for (const p of [player1, player2]) p.send({ action: "game.endTurn" });
      const endCycle = await player1.waitFor((m: any) => m.action === "game.endCycle");
      await Promise.all([
        player1.waitFor((m: any) => m.action === "game.startCycle"),
        player2.waitFor((m: any) => m.action === "game.startCycle"),
      ]);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player1.playerId,
          damage: 4,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player2.playerId,
          damage: 4,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player1.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player2.playerId,
        }),
      );
    });
  });

  describe("Pulsing Wind (бросок 4–5): 3 урона + сброс 2 случайных карт", () => {
    it("3 урона + ровно 2 карты сброшены из руки", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 0, hp: 15 });
      await admin.setBossRoll(4);

      const { endCycle } = await endTurnWithBoss(player);

      const discardMoves = endCycle.steps.filter(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          s.playerId === player.playerId,
      );
      expect(discardMoves).toHaveLength(2);
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 3,
          isPiercing: false,
          enemyId: bossId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player.playerId,
          damage: 3,
        }),
      );
    });

    it("щит частично поглощает урон: PlayerStatChange(-2) + PlayerTakeDamage(1)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 2, hp: 15 });
      await admin.setBossRoll(4);

      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "shield",
          playerId: player.playerId,
          delta: -2,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 1,
          isPiercing: false,
          enemyId: bossId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          damage: 3,
        }),
      );
    });

    it("щит полностью блокирует урон: PlayerStatChange(-3), нет PlayerTakeDamage", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 5, hp: 15 });
      await admin.setBossRoll(5);

      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "shield",
          playerId: player.playerId,
          delta: -3,
        }),
      );
      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          damage: 3,
        }),
      );
    });

    it("2 игрока: оба получают урон, у каждого 2 карты сброшены", async () => {
      game = await createTestGame(2);
      const {
        players: [player1, player2],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player1, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player1, admin);
      await removePlayerEnemies(player2, admin);
      await admin.updatePlayer(player1.playerId, { shield: 0, hp: 15 });
      await admin.updatePlayer(player2.playerId, { shield: 0, hp: 15 });
      await admin.setBossRoll(4);

      for (const p of [player1, player2]) p.send({ action: "game.endTurn" });
      const endCycle = await player1.waitFor((m: any) => m.action === "game.endCycle");
      await Promise.all([
        player1.waitFor((m: any) => m.action === "game.startCycle"),
        player2.waitFor((m: any) => m.action === "game.startCycle"),
      ]);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player1.playerId,
          damage: 3,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player2.playerId,
          damage: 3,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player1.playerId,
          damage: 3,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player2.playerId,
          damage: 3,
        }),
      );
      const p1Discards = endCycle.steps.filter(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          s.playerId === player1.playerId,
      );
      const p2Discards = endCycle.steps.filter(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          s.playerId === player2.playerId,
      );
      expect(p1Discards).toHaveLength(2);
      expect(p2Discards).toHaveLength(2);
    });

    it("порядок шагов: PlayerTakeDamage идёт до MoveCard(to=discard)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 0, hp: 15 });
      await admin.setBossRoll(4);

      const { endCycle } = await endTurnWithBoss(player);

      const damageIdx = endCycle.steps.findIndex(
        (s: any) => s.type === EDetailedStep.PlayerTakeDamage && s.playerId === player.playerId,
      );
      const firstDiscardIdx = endCycle.steps.findIndex(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          s.playerId === player.playerId,
      );
      expect(damageIdx).toBeGreaterThanOrEqual(0);
      expect(firstDiscardIdx).toBeGreaterThanOrEqual(0);
      expect(damageIdx).toBeLessThan(firstDiscardIdx);
    });

    it("0 карт в руке: 3 урона, MoveCard не генерируется", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 0, hp: 15 });
      for (const card of player.hand) {
        await admin.moveCard(player.playerId, card.cardId, "hand", "trash");
      }
      for (const card of player.deck) {
        await admin.moveCard(player.playerId, card.cardId, "deck", "trash");
      }
      await player.waitFor(
        (m: any) => m.action === "admin.stateSync" && m.you.hand.length === 0 && m.you.deck.length === 0,
      );
      await admin.setBossRoll(4);

      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 3,
        }),
      );
      expect(
        endCycle.steps.filter(
          (s: any) =>
            s.type === EDetailedStep.MoveCard &&
            s.to === "discard" &&
            s.playerId === player.playerId,
        ),
      ).toHaveLength(0);
    });

    it("1 карта в руке: 3 урона, ровно 1 MoveCard(to=discard)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 0, hp: 15 });
      for (const card of player.hand) {
        await admin.moveCard(player.playerId, card.cardId, "hand", "trash");
      }
      for (const card of player.deck.slice(1)) {
        await admin.moveCard(player.playerId, card.cardId, "deck", "trash");
      }
      await player.waitFor(
        (m: any) => m.action === "admin.stateSync" && m.you.hand.length === 0 && m.you.deck.length === 1,
      );
      await admin.setBossRoll(4);

      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 3,
        }),
      );
      expect(
        endCycle.steps.filter(
          (s: any) =>
            s.type === EDetailedStep.MoveCard &&
            s.to === "discard" &&
            s.playerId === player.playerId,
        ),
      ).toHaveLength(1);
    });
  });

  describe("Dragon's Breath (бросок 6): 4 пронзающего, уклонение через Dash или сброс 4 карт", () => {
    it("без уклонения: 4 пронзающего урона, EnemyAttack", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 0, hp: 15 });
      await admin.setBossRoll(6);

      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({ action: "game.dragonBreathResponse", taskId, type: "none" });
      });
      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 4,
          isPiercing: true,
          enemyId: bossId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player.playerId,
          damage: 4,
        }),
      );
    });

    it("пронзающий урон не блокируется щитом: нет PlayerStatChange(shield)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.updatePlayer(player.playerId, { shield: 10, hp: 15 });
      await admin.setBossRoll(6);

      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({ action: "game.dragonBreathResponse", taskId, type: "none" });
      });
      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          damage: 4,
          isPiercing: true,
        }),
      );
      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerStatChange,
          stat: "shield",
          playerId: player.playerId,
        }),
      );
    });

    it("уклонение через трэш Dash-карты: нет урона, MoveCard(to=trash)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      // Add Dash to deck (deckPosition=1 → drawn first by endTurn, so it's in hand when Dragon's Breath fires)
      await admin.addCard(player.playerId, ECard.Dash, "deck");
      const deckState = await admin.waitFor((m: any) => {
        if (m.action !== "admin.state") return false;
        const ps = m.players?.find((p: any) => p.playerId === player.playerId);
        return ps?.deck?.some((c: any) => c.name === ECard.Dash);
      });
      const dashId = deckState.players
        .find((p: any) => p.playerId === player.playerId)
        .deck.find((c: any) => c.name === ECard.Dash).cardId;
      await admin.setBossRoll(6);

      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({ action: "game.dragonBreathResponse", taskId, type: "dash", cardId: dashId });
      });
      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.MoveCard,
          to: "trash",
          playerId: player.playerId,
          card: expect.objectContaining({ name: ECard.Dash }),
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          damage: 4,
        }),
      );
    });

    it("уклонение через сброс 4 карт: нет урона, 4 MoveCard(to=discard)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.setBossRoll(6);

      // Capture drawn card IDs from game.endTurn (arrives before game.dragonBreath).
      // endTurn discards the current hand and draws 5 new cards; those drawn IDs are used for avoidance.
      let dragonBreathCardIds: string[] = [];
      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({
          action: "game.dragonBreathResponse",
          taskId,
          type: "discard",
          cardIds: dragonBreathCardIds,
        });
      });

      const endTurnCapture = player.waitFor((m: any) => {
        if (m.action !== "game.endTurn") return false;
        const drawStep = m.steps?.find((s: any) => s.type === "DrawCards");
        dragonBreathCardIds = (drawStep?.cards ?? []).slice(0, 4).map((c: any) => c.cardId);
        return true;
      });

      player.send({ action: "game.endTurn" });
      await endTurnCapture;

      const [endCycle, startCycle] = await Promise.all([
        player.waitFor((m: any) => m.action === "game.endCycle"),
        player.waitFor((m: any) => m.action === "game.startCycle"),
      ]);
      player.startCycleData = startCycle;

      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
        }),
      );
      const discardMoves = endCycle.steps.filter(
        (s: any) =>
          s.type === EDetailedStep.MoveCard &&
          s.to === "discard" &&
          dragonBreathCardIds.includes(s.card?.cardId),
      );
      expect(discardMoves).toHaveLength(4);
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          damage: 4,
        }),
      );
    });

    it("Dash не в руке: уклонение не засчитывается, 4 пронзающего урона", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.setBossRoll(6);

      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({
          action: "game.dragonBreathResponse",
          taskId,
          type: "dash",
          cardId: "non-existent-id",
        });
      });
      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          damage: 4,
          isPiercing: true,
        }),
      );
    });

    it("менее 4 cardIds для сброса: уклонение не засчитывается, урон наносится", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      const threeIds = [
        await ensureCardInHand(player, admin, ECard.ForeignRockblade),
        await ensureCardInHand(player, admin, ECard.StrikeOfFortune),
        await ensureCardInHand(player, admin, ECard.Chihayaburu),
      ];
      await admin.setBossRoll(6);

      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({
          action: "game.dragonBreathResponse",
          taskId,
          type: "discard",
          cardIds: threeIds,
        });
      });
      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          damage: 4,
          isPiercing: true,
        }),
      );
    });

    it("EnemyAttack присутствует даже при уклонении (Dash)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.addCard(player.playerId, ECard.Dash, "deck");
      const deckState = await admin.waitFor((m: any) => {
        if (m.action !== "admin.state") return false;
        const ps = m.players?.find((p: any) => p.playerId === player.playerId);
        return ps?.deck?.some((c: any) => c.name === ECard.Dash);
      });
      const dashId = deckState.players
        .find((p: any) => p.playerId === player.playerId)
        .deck.find((c: any) => c.name === ECard.Dash).cardId;
      await admin.setBossRoll(6);

      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({ action: "game.dragonBreathResponse", taskId, type: "dash", cardId: dashId });
      });
      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player.playerId,
          damage: 4,
        }),
      );
    });

    it("2 игрока: player1 уклоняется (Dash), player2 получает 4 пронзающего урона", async () => {
      game = await createTestGame(2);
      const {
        players: [player1, player2],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player1, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player1, admin);
      await removePlayerEnemies(player2, admin);
      await admin.addCard(player1.playerId, ECard.Dash, "deck");
      const deckState = await admin.waitFor((m: any) => {
        if (m.action !== "admin.state") return false;
        const ps = m.players?.find((p: any) => p.playerId === player1.playerId);
        return ps?.deck?.some((c: any) => c.name === ECard.Dash);
      });
      const dashId = deckState.players
        .find((p: any) => p.playerId === player1.playerId)
        .deck.find((c: any) => c.name === ECard.Dash).cardId;
      await admin.updatePlayer(player2.playerId, { shield: 0, hp: 15 });
      await admin.setBossRoll(6);

      player1.setTaskHandler("game.dragonBreath", (taskId) => {
        player1.send({
          action: "game.dragonBreathResponse",
          taskId,
          type: "dash",
          cardId: dashId,
        });
      });

      for (const p of [player1, player2]) p.send({ action: "game.endTurn" });
      const endCycle = await player1.waitFor((m: any) => m.action === "game.endCycle");
      await Promise.all([
        player1.waitFor((m: any) => m.action === "game.startCycle"),
        player2.waitFor((m: any) => m.action === "game.startCycle"),
      ]);

      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player1.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.MoveCard,
          to: "trash",
          card: expect.objectContaining({ name: ECard.Dash }),
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player2.playerId,
          damage: 4,
          isPiercing: true,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player1.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player2.playerId,
        }),
      );
    });

    it("2 игрока: оба уклоняются через сброс 4 карт — никто не получает урон", async () => {
      game = await createTestGame(2);
      const {
        players: [player1, player2],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player1, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player1, admin);
      await removePlayerEnemies(player2, admin);
      await admin.setBossRoll(6);

      let p1DragonIds: string[] = [];
      let p2DragonIds: string[] = [];

      player1.setTaskHandler("game.dragonBreath", (taskId) => {
        player1.send({ action: "game.dragonBreathResponse", taskId, type: "discard", cardIds: p1DragonIds });
      });
      player2.setTaskHandler("game.dragonBreath", (taskId) => {
        player2.send({ action: "game.dragonBreathResponse", taskId, type: "discard", cardIds: p2DragonIds });
      });

      // Each player's game.endTurn (broadcast to all) contains their DrawCards step.
      // Filter by playerID so each capture reads its own drawn cards.
      const p1EndTurnCapture = player1.waitFor((m: any) => {
        if (m.action !== "game.endTurn" || m.playerID !== player1.playerId) return false;
        const drawStep = m.steps?.find((s: any) => s.type === "DrawCards");
        p1DragonIds = (drawStep?.cards ?? []).slice(0, 4).map((c: any) => c.cardId);
        return true;
      });
      const p2EndTurnCapture = player2.waitFor((m: any) => {
        if (m.action !== "game.endTurn" || m.playerID !== player2.playerId) return false;
        const drawStep = m.steps?.find((s: any) => s.type === "DrawCards");
        p2DragonIds = (drawStep?.cards ?? []).slice(0, 4).map((c: any) => c.cardId);
        return true;
      });

      for (const p of [player1, player2]) p.send({ action: "game.endTurn" });
      await Promise.all([p1EndTurnCapture, p2EndTurnCapture]);

      const results = await Promise.all([
        player1.waitFor((m: any) => m.action === "game.endCycle"),
        player1.waitFor((m: any) => m.action === "game.startCycle"),
        player2.waitFor((m: any) => m.action === "game.startCycle"),
      ]);
      const endCycle = results[0];

      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player1.playerId,
        }),
      );
      expect(endCycle.steps).not.toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player2.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player1.playerId,
        }),
      );
      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyAttack,
          enemyId: bossId,
          playerId: player2.playerId,
        }),
      );
    });

    it("4 ID переданы, хотя бы 1 невалиден: уклонение не засчитывается, 4 пронзающего урона", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await removePlayerEnemies(player, admin);
      await admin.setBossRoll(6);

      player.setTaskHandler("game.dragonBreath", (taskId) => {
        player.send({
          action: "game.dragonBreathResponse",
          taskId,
          type: "discard",
          cardIds: ["fake-1", "fake-2", "fake-3", "fake-4"],
        });
      });
      const { endCycle } = await endTurnWithBoss(player);

      expect(endCycle.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.playerId,
          damage: 4,
          isPiercing: true,
        }),
      );
    });
  });

  describe("Многожизненность (BossReset)", () => {
    it("смерть при lives>1: шаг BossReset, EnemyDeath нет, босс остаётся живым", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.updateBoss({ hp: 1, shield: 0, lives: 2 });
      const cardId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      const response = await player.waitFor((m: any) => m.action === "game.useCard");

      expect(response.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.BossReset,
          bossId,
          livesRemaining: 1,
        }),
      );
      expect(response.steps).not.toContainEqual(
        expect.objectContaining({ type: EDetailedStep.EnemyDeath }),
      );
      expect(response.boss).not.toBeNull();
    });

    it("BossReset восстанавливает HP и щит до максимума (1 игрок: 15 HP, 2 щита)", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.updateBoss({ hp: 1, shield: 0, lives: 2 });
      const cardId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      const response = await player.waitFor((m: any) => m.action === "game.useCard");

      const resetStep = response.steps.find(
        (s: any) => s.type === EDetailedStep.BossReset,
      );
      expect(resetStep.hp).toBe(15);
      expect(resetStep.shield).toBe(2);
      expect(response.boss.hp).toBe(15);
      expect(response.boss.shield).toBe(2);
    });

    it("смерть при lives=1: game.win отправляется, boss=null в ответе", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.updateBoss({ hp: 1, shield: 0, lives: 1 });
      const cardId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      await player.waitFor((m: any) => m.action === "game.win");
      const response = await player.waitFor((m: any) => m.action === "game.useCard");

      expect(response.boss).toBeNull();
      expect(response.steps).not.toContainEqual(
        expect.objectContaining({ type: EDetailedStep.BossReset }),
      );
    });

    it("3 жизни: BossReset.livesRemaining убывает 2 → 1 → game.win", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.updateBoss({ hp: 1, shield: 0, lives: 3 });
      await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3 } });
      const cardId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      const response1 = await player.waitFor((m: any) => m.action === "game.useCard");
      expect(response1.steps).toContainEqual(
        expect.objectContaining({ type: EDetailedStep.BossReset, livesRemaining: 2 }),
      );

      await admin.updateBoss({ hp: 1, shield: 0 });
      await admin.moveCard(player.playerId, cardId, "discard", "hand");
      await player.waitFor((m: any) => m.action === "admin.stateSync");

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      const response2 = await player.waitFor((m: any) => m.action === "game.useCard");
      expect(response2.steps).toContainEqual(
        expect.objectContaining({ type: EDetailedStep.BossReset, livesRemaining: 1 }),
      );

      await admin.updateBoss({ hp: 1, shield: 0 });
      await admin.moveCard(player.playerId, cardId, "discard", "hand");
      await player.waitFor((m: any) => m.action === "admin.stateSync");

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      await player.waitFor((m: any) => m.action === "game.win");
    });

    it("BossReset очищает элементы босса", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.updateBoss({ hp: 1, shield: 0, lives: 2, elements: [EElement.Pyro] });
      const cardId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);

      player.send({ action: "game.useCard", cardId, enemies: [bossId] });
      const response = await player.waitFor((m: any) => m.action === "game.useCard");

      expect(response.steps).toContainEqual(
        expect.objectContaining({ type: EDetailedStep.BossReset }),
      );
      expect(response.boss.elements).toEqual([]);
    });
  });

  describe("Leylines при активном боссе", () => {
    it("leylines не применяются: пустой массив и нет UseLeyline в startCycle.steps", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.setBossRoll(1);

      const { startCycle } = await endTurnWithBoss(player);

      expect(startCycle.leylines).toEqual([]);
      expect(startCycle.steps).not.toContainEqual(
        expect.objectContaining({ type: EDetailedStep.UseLeyline }),
      );
    });

    it("цикл 3 — 1 leyline", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.request({ action: "admin.setState", cycle: 2 });
      await admin.setBossRoll(1);

      const { startCycle } = await endTurnWithBoss(player);

      expect(startCycle.leylines).toHaveLength(1);
      expect(startCycle.steps).toContainEqual(
        expect.objectContaining({ type: EDetailedStep.UseLeyline }),
      );
    });

    it("цикл 6 — 2 leylines", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.request({ action: "admin.setState", cycle: 5 });
      await admin.setBossRoll(1);

      const { startCycle } = await endTurnWithBoss(player);

      expect(startCycle.leylines).toHaveLength(2);
      const useLeylineSteps = startCycle.steps.filter(
        (s: any) => s.type === EDetailedStep.UseLeyline,
      );
      expect(useLeylineSteps).toHaveLength(2);
    });

    it("цикл 9 — 3 leylines", async () => {
      game = await createTestGame(1);
      const {
        players: [player],
        admin,
      } = game;
      await spawnTestBoss(player, admin, EEnemy.Dvalin);
      await admin.request({ action: "admin.setState", cycle: 8 });
      await admin.setBossRoll(1);

      const { startCycle } = await endTurnWithBoss(player);

      expect(startCycle.leylines).toHaveLength(3);
      const useLeylineSteps = startCycle.steps.filter(
        (s: any) => s.type === EDetailedStep.UseLeyline,
      );
      expect(useLeylineSteps).toHaveLength(3);
    });
  });
});
