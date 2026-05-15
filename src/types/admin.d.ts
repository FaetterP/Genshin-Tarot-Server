import type { PlayerPrimitive } from "./general";
import type { ECard, EElement, EEnemyEffect, EEnemy, EPlayerEffect } from "./enums";

export type AdminStateSnapshot = {
  isGameStart: boolean;
  cycle: number;
  players: PlayerPrimitive[];
};

export type AdminUpdatePlayerPayload = {
  playerId: string;
  hp?: number;
  energy?: number;
  shield?: number;
  mora?: number;
  actionPoints?: { normal?: number; extra?: number };
};

export type AdminUpdateEnemyPayload = {
  enemyId: string;
  hp?: number;
  shield?: number;
  isStunned?: boolean;
};

export type AdminKillEnemyPayload = {
  enemyId: string;
};

export type CardPile = "hand" | "discard" | "deck";

export type AdminMoveCardPayload = {
  playerId: string;
  cardId: string;
  from: CardPile;
  to: CardPile;
};

export type AdminSetStateEnemyPayload = {
  id: string;
  hp?: number;
  shield?: number;
  isStunned?: boolean;
  elements?: EElement[];
  effects?: EEnemyEffect[];
};

export type AdminSetStatePlayerPayload = {
  playerId: string;
  hp?: number;
  shields?: number;
  energy?: number;
  mora?: number;
  wave?: number;
  eulaSnowflakes?: number;
  actionPoints?: { normal?: number; extra?: number };
  effects?: EPlayerEffect[];
  enemies?: AdminSetStateEnemyPayload[];
};

export type AdminSetStatePayload = {
  isGameStart?: boolean;
  cycle?: number;
  players?: AdminSetStatePlayerPayload[];
};

export type AdminAddEnemyPayload = {
  playerId: string;
  enemyName: EEnemy;
};

export type AdminRemoveEnemyPayload = {
  enemyId: string;
};

export type AdminAddCardPayload = {
  playerId: string;
  cardName: ECard;
  to: CardPile;
};
