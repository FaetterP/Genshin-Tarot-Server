import { Character } from "../src/storage/characters/Character";

export type ElementReactionContext = {
    player: Player;
    enemy: Enemy;
  };

export type CardAttackContext = {
  attacker: Player;
  enemy: Enemy;
};

export type CardUseContext = {
  player: Player;
};

export type CharacterUseBurstContext = {
  character: Character;
  data: any;
};
