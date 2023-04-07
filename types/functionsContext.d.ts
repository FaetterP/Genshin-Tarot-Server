import { Player } from "../src/game/Player";
import { Character } from "../src/storage/characters/Character";
import { Enemy } from "../src/storage/enemies/Enemy";

export type ElementReactionContext = {
  player: Player;
  enemy: Enemy;
};

export type CardUseContext = {
  player: Player;
  enemies?: Enemy[];
  selectedPlayer?: Player;
  isUseAlternative?: boolean;
};

export type CharacterUseBurstContext = {
  character: Character;
  player: Player;
  allPlayers: Player[];
  selectedEnemy?: Enemy;
  selectedPlayer?: Player;
};
