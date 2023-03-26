import { Player } from "../src/game/Player";
import { Enemy } from "../src/storage/enemies/Enemy";

export type EnemyDeathContext = {
  enemy: Enemy;
};

export type PlayerEndsWavesContext = {
  player: Player;
};
