import { Player } from "../game/Player";
import { BaseElement } from "../storage/elements/BaseElement";

export type EnemyPrimitive = {
  id: string;
  name: string;
  hp: number;
  shield: number;
  elements: EElement[];
  isStunned: boolean;
  effects: string[];
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
  element?: BaseElement;
  player: Player;
};

export type CardPrimitive = {
  cardId: string;
  name: string;
  type: ECardType;
  deckPosition?: number;
};
