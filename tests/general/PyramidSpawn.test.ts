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

// ─────────────────────────────── helpers ────────────────────────────────── //

function faceUpSlots(pyramid: any[][]): any[] {
  return pyramid.flat().filter((s: any) => !s.faceDown);
}

function faceDownSlots(pyramid: any[][]): any[] {
  return pyramid.flat().filter((s: any) => s.faceDown);
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
  const faceUp = faceUpSlots(player.startCycleData.you.pyramid);
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

// ──────────────────────────────── tests ─────────────────────────────────── //

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

  it("pyramid содержит 6 рядов с формой [1, 2, 3, 2, 1, 2] при старте игры", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const pyramid: any[][] = player.startCycleData.you.pyramid;

    expect(pyramid).toHaveLength(6);
    expect(pyramid[0]).toHaveLength(1);
    expect(pyramid[1]).toHaveLength(2);
    expect(pyramid[2]).toHaveLength(3);
    expect(pyramid[3]).toHaveLength(2);
    expect(pyramid[4]).toHaveLength(1);
    expect(pyramid[5]).toHaveLength(2);
  });

  it("ряд 0 открыт при старте, остальные 10 слотов закрыты", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const pyramid: any[][] = player.startCycleData.you.pyramid;

    expect(faceUpSlots(pyramid)).toHaveLength(1);
    expect(faceDownSlots(pyramid)).toHaveLength(10);
    expect(pyramid[0][0].faceDown).toBe(false);
    expect(pyramid[1].every((s: any) => s.faceDown)).toBe(true);
    expect(pyramid[2].every((s: any) => s.faceDown)).toBe(true);
  });

  it("enemies[] при старте содержит ровно 1 врага — верхний элемент пирамиды", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const enemies = player.startCycleData.you.enemies;
    const topSlot = player.startCycleData.you.pyramid[0][0];

    expect(enemies).toHaveLength(1);
    expect(enemies[0].id).toBe(topSlot.id);
  });

  it("covers верхнего врага ссылается на ID обоих слотов ряда 1", async () => {
    game = await createTestGame();
    const [player] = game.players;

    const pyramid: any[][] = player.startCycleData.you.pyramid;
    const topEnemy = pyramid[0][0];
    const row1Ids = pyramid[1].map((s: any) => s.id);

    expect(topEnemy.covers).toHaveLength(2);
    expect(topEnemy.covers).toEqual(expect.arrayContaining(row1Ids));
    expect(row1Ids).toEqual(expect.arrayContaining(topEnemy.covers));
  });

  it("EnemyReveal × 2 приходит в game.endCycle после убийства ряда 0", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const topSlot = player.startCycleData.you.pyramid[0][0];
    const expectedRow1Ids = new Set<string>(topSlot.covers);

    await killEnemy(admin, topSlot.id, player);
    await admin.setLeylines([]);

    player.send({ action: "game.endTurn" });
    const endCycle = await player.waitFor((m: any) => m.action === "game.endCycle");

    const reveals = endCycle.steps.filter((s: any) => s.type === EDetailedStep.EnemyReveal);
    expect(reveals).toHaveLength(2);
    expect(reveals.every((r: any) => expectedRow1Ids.has(r.enemy.id))).toBe(true);
  });

  it("EnemyReveal содержит полные данные врага с faceDown: false и covers", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const topSlot = player.startCycleData.you.pyramid[0][0];
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

  it("после раскрытия ряда 1 — pyramid показывает 2 face-up врага, enemies[] имеет 2 элемента", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await killEnemy(admin, player.startCycleData.you.pyramid[0][0].id, player);
    await admin.setLeylines([]);

    player.send({ action: "game.endTurn" });
    await player.waitFor((m: any) => m.action === "game.endCycle");
    const cycle2 = await player.waitFor((m: any) => m.action === "game.startCycle");
    player.startCycleData = cycle2;

    expect(faceUpSlots(cycle2.you.pyramid)).toHaveLength(2);
    expect(faceDownSlots(cycle2.you.pyramid)).toHaveLength(8);
    expect(cycle2.you.enemies).toHaveLength(2);
    expect(cycle2.you.pyramid.flat()).toHaveLength(10);
  });

  it("убийство одного из двух ряда 1 раскрывает ровно 1 врага из ряда 2", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    // reveal row 1
    await killEnemy(admin, player.startCycleData.you.pyramid[0][0].id, player);
    await admin.setLeylines([]);
    player.send({ action: "game.endTurn" });
    await player.waitFor((m: any) => m.action === "game.endCycle");
    const cycle2 = await player.waitFor((m: any) => m.action === "game.startCycle");
    player.startCycleData = cycle2;

    // kill only one of the two row-1 enemies
    const row1Slot = faceUpSlots(cycle2.you.pyramid)[0];
    await killEnemy(admin, row1Slot.id, player);
    await admin.setLeylines([]);
    player.send({ action: "game.endTurn" });
    const endCycle3 = await player.waitFor((m: any) => m.action === "game.endCycle");

    const reveals = endCycle3.steps.filter((s: any) => s.type === EDetailedStep.EnemyReveal);
    expect(reveals).toHaveLength(1);
  });

  it("элитный враг (ряд 4) не открывается пока жив один из двух из ряда 3", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    // kill rows 0, 1, 2 to reveal row 3
    for (let i = 0; i < 3; i++) {
      await killFaceUpAndAdvanceCycle(player, admin);
    }

    // row 3 is now face-up (2 enemies)
    const row3Slots = faceUpSlots(player.startCycleData.you.pyramid);
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

  it("элитный враг (ряд 4) открывается после гибели обоих из ряда 3", async () => {
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
    expect(faceUpSlots(player.startCycleData.you.pyramid)).toHaveLength(1);
    expect(faceDownSlots(player.startCycleData.you.pyramid)).toHaveLength(2);
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
    const eliteSlots = faceUpSlots(player.startCycleData.you.pyramid);
    expect(eliteSlots).toHaveLength(2);

    // kill first elite — boss should not spawn yet
    await killEnemy(admin, eliteSlots[0].id, player);

    // kill second elite — boss spawns
    const syncWithBoss = await killEnemy(admin, eliteSlots[1].id, player);
    expect(syncWithBoss.boss).not.toBeNull();
    expect(syncWithBoss.you.pyramid).toEqual([]);
    expect(syncWithBoss.you.enemies).toEqual([]);
  });
});
