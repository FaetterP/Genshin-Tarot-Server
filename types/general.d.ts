export type EnemyPrimitive = {
  id: string;
  name: string;
  hp: number;
  shield: number;
  elements: string[];
};

export type PlayerPrimitive = {
  playerId: string;
  hp: number;
  wave: number;
  enemies: EnemyPrimitive[];
};
