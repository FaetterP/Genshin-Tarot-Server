import type { PlayerPrimitive } from "./general";

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
