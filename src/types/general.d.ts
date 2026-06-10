import { Player } from "../game/Player";
import type {
  ECard,
  ECardType,
  ECharacter,
  EElement,
  EEnemy,
  EEnemyEffect,
  EPlayerEffect,
} from "./enums";

export type EnemyPrimitive = {
  id: string;
  name: EEnemy;
  hp: number;
  shield: number;
  elements: EElement[];
  isStunned: boolean;
  effects: EEnemyEffect[];
};

export type PyramidSlot =
  | { id: string; faceDown: true; isElite: boolean; covers: string[] }
  | (EnemyPrimitive & { faceDown: false; covers: string[] });

export type BossPrimitive = EnemyPrimitive & {
  lives: number;
};

export type PlayerPrimitive = {
  playerId: string;
  characters: ECharacter[];
  hp: number;
  shields: number;
  energy: number;
  mora: number;
  actionPoints: {
    normal: number;
    extra: number;
    total: number;
  };
  enemies: PyramidSlot[];
  effects: EPlayerEffect[];
  hand: CardPrimitive[];
  discard: CardPrimitive[];
  deck: CardPrimitive[];

  eulaSnowflakes: number;
  raidenPoints: number;
  razorPoints: number;
};

export type Attack = {
  damage: number;
  isPiercing?: boolean;
  isRange?: boolean;
  player: Player;
};

export type CardPrimitive = {
  cardId: string;
  name: ECard;
  type: ECardType;
  deckPosition?: number;
};
