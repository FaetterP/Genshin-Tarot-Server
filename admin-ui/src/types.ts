export type CardPrimitive = {
  cardId: string;
  name: string;
  type: string;
  deckPosition?: number;
};

export type EnemyPrimitive = {
  id: string;
  name: string;
  hp: number;
  shield: number;
  elements: string[];
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
  actionPoints: { normal: number; extra: number; total: number };
  wave: number;
  enemies: EnemyPrimitive[];
  effects: string[];
  hand: CardPrimitive[];
  discard: CardPrimitive[];
  deck: CardPrimitive[];
  eulaSnowflakes: number;
};

export type AdminStateSnapshot = {
  isGameStart: boolean;
  cycle: number;
  players: PlayerPrimitive[];
};
