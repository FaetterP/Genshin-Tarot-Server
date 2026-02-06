import { Player } from "../game/Player";
import { Element } from "../storage/elements/Element";

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
  shields: number;
  energy: number;
  mora: number;
  actionPoints: {
    normal: number;
    extra: number;
    total: number;
  };
  wave: number;
  enemies: EnemyPrimitive[];
  effects: string[];
  hand: CardPrimitive[];
  discard: CardPrimitive[];
  deck: CardPrimitive[];
};

export type Attack = {
  damage: number;
  isPiercing?: boolean;
  isRange?: boolean;
  element?: Element;
  player: Player;
};

export type CardPrimitive = {
  cardId: string;
  name: string;
};
