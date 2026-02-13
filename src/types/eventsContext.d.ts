import type { DetailedStep } from "./detailedStep";
import { Player } from "../game/Player";
import { Enemy } from "../storage/enemies/Enemy";
import type { Card } from "../storage/cards/Card";

export type EnemyDeathContext = {
  enemy: Enemy;
};

export type EnemyStartCycleContext = {
  enemy: Enemy;
  player: Player;
  playerId: string;
  addToSteps: (data: DetailedStep[]) => void;
};

export type EnemyEndCycleContext = {
  enemy: Enemy;
  playerId: string;
  addToSteps: (data: DetailedStep[]) => void;
};

export type PlayerEndsWavesContext = {
  player: Player;
};

export type CycleStartContext = {
  cycle: number;
  addToSteps: (data: DetailedStep[]) => void;
};

export type CycleEndContext = {
  cycle: number;
  addToSteps: (data: DetailedStep[]) => void;
};

export type PlayerUseCardContext = {
  player: Player;
  usedCard: Card;
};

export type PlayerEndTurnContext = {
  player: Player;
  addToSteps: (data: DetailedStep[]) => void;

  eulaSelectedEnemies?: Enemy[];
};
