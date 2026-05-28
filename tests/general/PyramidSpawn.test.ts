/**
 * PyramidSpawn — механика спавна врагов через пирамиду [1, 2, 3, 2, 1, 2].
 * Проверяет структуру данных пирамиды, порядок раскрытия карт и спавн босса.
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from "@jest/globals";
import { EDetailedStep } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(30000);

function faceUpSlots(enemies: any[]): any[] {
  return enemies.filter((s: any) => !s.faceDown);
}

function faceDownSlots(enemies: any[]): any[] {
  return enemies.filter((s: any) => s.faceDown);
}

async function killEnemy(admin: any, enemyId: string, player: any): Promise<any> {
  await admin.request({ action: "admin.killEnemy", enemyId });
  return player.waitFor((m: any) => m.action === "admin.stateSync");
}

/**
 * Kills all currently face-up pyramid enemies, then ends the turn.
 * Returns endCycle and startCycle messages.
 * Clears leylines before endTurn so random effects don't break the test.
 */
async function killFaceUpAndAdvanceCycle(
  player: any,
  admin: any,
): Promise<{ endCycle: any; startCycle: any }> {
  const faceUp = faceUpSlots(player.startCycleData.you.enemies);
  for (const slot of faceUp) {
    await killEnemy(admin, slot.id, player);
  }
  await admin.setLeylines([]);
  player.send({ action: "game.endTurn" });
  const endCycle = await player.waitFor((m: any) => m.action === "game.endCycle");
  const startCycle = await player.waitFor((m: any) => m.action === "game.startCycle");
  player.startCycleData = startCycle;
  return { endCycle, startCycle };
}

describe("Pyramid — структура и механика спавна врагов", () => {
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

  it("enemies содержит 11 врагов при старте: 1 face-up и 10 face-down", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const enemies = player.startCycleData.you.enemies;

    expect(enemies).toHaveLength(11);
    expect(faceUpSlots(enemies)).toHaveLength(1);
    expect(faceDownSlots(enemies)).toHaveLength(10);
  });

  it("верхний враг face-up при старте, остальные 10 слотов закрыты", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const enemies = player.startCycleData.you.enemies;

    expect(faceUpSlots(enemies)).toHaveLength(1);
    expect(faceDownSlots(enemies)).toHaveLength(10);
    expect(faceUpSlots(enemies)[0].faceDown).toBe(false);
    expect(faceDownSlots(enemies).every((s: any) => s.faceDown)).toBe(true);
  });

  it("верхний face-up враг содержит covers на 2 face-down слота", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const enemies = player.startCycleData.you.enemies;
    const topEnemy = faceUpSlots(enemies)[0];
    const faceDownIds = new Set(faceDownSlots(enemies).map((e: any) => e.id));

    expect(topEnemy.covers).toHaveLength(2);
    topEnemy.covers.forEach((id: string) => expect(faceDownIds.has(id)).toBe(true));
  });

  it("covers верхнего врага ссылается на ID обоих ближайших face-down слотов", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const enemies = player.startCycleData.you.enemies;
    const topEnemy = faceUpSlots(enemies)[0];
    const faceDownIds = faceDownSlots(enemies).map((s: any) => s.id);

    expect(topEnemy.covers).toHaveLength(2);
    expect(faceDownIds).toEqual(expect.arrayContaining(topEnemy.covers));
  });

  it("EnemyReveal × 2 приходит в game.endCycle после убийства верхнего врага", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const topSlot = faceUpSlots(player.startCycleData.you.enemies)[0];
    const expectedNextIds = new Set<string>(topSlot.covers);

    await killEnemy(admin, topSlot.id, player);
    await admin.setLeylines([]);

    player.send({ action: "game.endTurn" });
    const endCycle = await player.waitFor((m: any) => m.action === "game.endCycle");

    const reveals = endCycle.steps.filter((s: any) => s.type === EDetailedStep.EnemyReveal);
    expect(reveals).toHaveLength(2);
    expect(reveals.every((r: any) => expectedNextIds.has(r.enemy.id))).toBe(true);
  });

  it("EnemyReveal содержит полные данные врага с faceDown: false и covers", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const topSlot = faceUpSlots(player.startCycleData.you.enemies)[0];
    await killEnemy(admin, topSlot.id, player);
    await admin.setLeylines([]);

    player.send({ action: "game.endTurn" });
    const endCycle = await player.waitFor((m: any) => m.action === "game.endCycle");

    const reveal = endCycle.steps.find((s: any) => s.type === EDetailedStep.EnemyReveal);
    expect(reveal.enemy.faceDown).toBe(false);
    expect(reveal.enemy.covers).toBeDefined();
    expect(Array.isArray(reveal.enemy.covers)).toBe(true);
    expect(typeof reveal.enemy.hp).toBe("number");
    expect(typeof reveal.enemy.name).toBe("string");
  });

  it("после раскрытия 2 следующих врагов: 2 face-up, 8 face-down, 10 итого", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await killEnemy(admin, faceUpSlots(player.startCycleData.you.enemies)[0].id, player);
    await admin.setLeylines([]);

    player.send({ action: "game.endTurn" });
    await player.waitFor((m: any) => m.action === "game.endCycle");
    const cycle2 = await player.waitFor((m: any) => m.action === "game.startCycle");
    player.startCycleData = cycle2;

    expect(faceUpSlots(cycle2.you.enemies)).toHaveLength(2);
    expect(faceDownSlots(cycle2.you.enemies)).toHaveLength(8);
    expect(cycle2.you.enemies).toHaveLength(10);
  });

  it("убийство одного из двух раскрытых врагов — раскрывается ровно 1 следующий", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    // reveal next 2
    await killEnemy(admin, faceUpSlots(player.startCycleData.you.enemies)[0].id, player);
    await admin.setLeylines([]);
    player.send({ action: "game.endTurn" });
    await player.waitFor((m: any) => m.action === "game.endCycle");
    const cycle2 = await player.waitFor((m: any) => m.action === "game.startCycle");
    player.startCycleData = cycle2;

    // kill only one of the two revealed enemies
    const slot = faceUpSlots(cycle2.you.enemies)[0];
    await killEnemy(admin, slot.id, player);
    await admin.setLeylines([]);
    player.send({ action: "game.endTurn" });
    const endCycle3 = await player.waitFor((m: any) => m.action === "game.endCycle");

    const reveals = endCycle3.steps.filter((s: any) => s.type === EDetailedStep.EnemyReveal);
    expect(reveals).toHaveLength(1);
  });

  it("элитный враг не открывается пока жив один из двух его блокирующих", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    // kill rows 0, 1, 2 to reveal row 3
    for (let i = 0; i < 3; i++) {
      await killFaceUpAndAdvanceCycle(player, admin);
    }

    // row 3 is now face-up (2 enemies)
    const row3Slots = faceUpSlots(player.startCycleData.you.enemies);
    expect(row3Slots).toHaveLength(2);

    // kill only one → elite should NOT reveal
    await killEnemy(admin, row3Slots[0].id, player);
    await admin.setLeylines([]);
    player.send({ action: "game.endTurn" });
    const endCyclePartial = await player.waitFor((m: any) => m.action === "game.endCycle");

    const partialReveals = endCyclePartial.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyReveal,
    );
    expect(partialReveals).toHaveLength(0);
  });

  it("элитный враг открывается после гибели обоих его блокирующих", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    // kill rows 0, 1, 2 to reveal row 3
    for (let i = 0; i < 3; i++) {
      await killFaceUpAndAdvanceCycle(player, admin);
    }

    // kill both row-3 enemies
    const { endCycle } = await killFaceUpAndAdvanceCycle(player, admin);

    const reveals = endCycle.steps.filter((s: any) => s.type === EDetailedStep.EnemyReveal);
    expect(reveals).toHaveLength(1);

    // after reveal: 1 face-up elite, 2 face-down elites remain
    expect(faceUpSlots(player.startCycleData.you.enemies)).toHaveLength(1);
    expect(faceDownSlots(player.startCycleData.you.enemies)).toHaveLength(2);
  });

  it("бос спавнится после гибели всех 11 врагов пирамиды", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    // kill rows 0-4 (9 enemies) over 5 cycles
    for (let i = 0; i < 5; i++) {
      await killFaceUpAndAdvanceCycle(player, admin);
    }

    // row 5: 2 elites now face-up
    const eliteSlots = faceUpSlots(player.startCycleData.you.enemies);
    expect(eliteSlots).toHaveLength(2);

    // kill first elite — boss should not spawn yet
    await killEnemy(admin, eliteSlots[0].id, player);

    // kill second elite — boss spawns
    const syncWithBoss = await killEnemy(admin, eliteSlots[1].id, player);
    expect(syncWithBoss.boss).not.toBeNull();
    expect(syncWithBoss.you.enemies).toEqual([]);
  });
});
