import type { DetailedStep } from "./detailedStep";
import { Player } from "../src/game/Player";
import { Enemy } from "../src/storage/enemies/Enemy";

export type EnemyDeathContext = {
  enemy: Enemy;
};

export type EnemyEndCycleContext = {
  enemy: Enemy;
  addToReport: (data: any[]) => void;
  addToSteps: (data: DetailedStep[]) => void;
};

export type PlayerEndsWavesContext = {
  player: Player;
};

export type CycleStartContext = {
  cycle: number;
  // leylines: { name: string; use: (player: Player) => void }[];
  addToReport: (data: any[]) => void;
  addToSteps: (data: DetailedStep[]) => void;
};

export type CycleEndContext = {
  cycle: number;
  addToReport: (data: any[]) => void;
  addToSteps: (data: DetailedStep[]) => void;
};
