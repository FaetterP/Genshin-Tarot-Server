import { Player } from "../game/Player";
import { Character } from "../storage/characters/Character";
import { Enemy } from "../storage/enemies/Enemy";
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
  addToSteps: (data: DetailedStep[]) => void;
  selectedEnemy?: Enemy;
  selectedPlayer?: Player;

  // Barbara
  divide?: { player: Player; count: number }[];

  // Mona
  selectedCharacter?: Character;

  // Tartaglia
  selectedEnemies?: Enemy[];
};
