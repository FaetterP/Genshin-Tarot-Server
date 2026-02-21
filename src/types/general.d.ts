import { Player } from "../game/Player";
import { BaseElement } from "../storage/elements/BaseElement";
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
  wave: number;
  enemies: EnemyPrimitive[];
  effects: EPlayerEffect[];
  hand: CardPrimitive[];
  discard: CardPrimitive[];
  deck: CardPrimitive[];

  eulaSnowflakes: number;
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
  name: ECard;
  type: ECardType;
  deckPosition?: number;
};
