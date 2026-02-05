import { Player } from "../src/game/Player";
import { Character } from "../src/storage/characters/Character";
import { Enemy } from "../src/storage/enemies/Enemy";
import type { DetailedStep } from "./detailedStep";

export type ElementReactionContext = {
  player: Player;
  enemy: Enemy;
};

export type CardUseContext = {
  player: Player;
  enemies?: Enemy[];
  selectedPlayer?: Player;
  isUseAlternative?: boolean;
  addToSteps: (data: DetailedStep[]) => void;
};

export type CharacterUseBurstContext = {
  character: Character;
  player: Player;
  allPlayers: Player[];
  selectedEnemy?: Enemy;
  selectedPlayer?: Player;

  // Barbara
  divide?: { player: Player; count: number }[];

  // Mona
  selectedCharacter?: Character;

  // Tartaglia
  selectedEnemies?: Enemy[];
};
