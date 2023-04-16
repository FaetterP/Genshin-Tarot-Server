import { Player } from "../src/game/Player";
import { Element } from "../src/storage/elements/Element";

export type EnemyPrimitive = {
  id: string;
  name: string;
  hp: number;
  shield: number;
  elements: string[];
  isStunned: boolean;
};

export type PlayerPrimitive = {
  playerId: string;
  characters: string[];
  hp: number;
  wave: number;
  enemies: EnemyPrimitive[];
  effects: string[];
};

export type Attack = {
  damage: number;
  isPiercing?: boolean;
  isRange?: boolean;
  element?: Element;
  player: Player;
};
