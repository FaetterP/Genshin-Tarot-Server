import type { DetailedStep } from "./detailedStep";
import { Player } from "../game/Player";
import { Enemy } from "../storage/enemies/Enemy";

export type EnemyDeathContext = {
  enemy: Enemy;
};

export type EnemyStartCycleContext = {
  enemy: Enemy;
  playerId: string;
  addToReport: (data: any[]) => void;
  addToSteps: (data: DetailedStep[]) => void;
};

export type EnemyEndCycleContext = {
  enemy: Enemy;
  playerId: string;
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
