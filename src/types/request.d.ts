import type { ECharacter, ECard } from "./enums";

export type GameStartRequest = { action: "game.startGame" };

export type GameEndTurnRequest = {
  action: "game.endTurn";
  eulaBurstTargets?: string[];
};

export type GameUseCardRequest = {
  action: "game.useCard";
  cardId: string;
  card?: ECard;
  enemies?: string[];
  isUseAlternative?: boolean;
  selectedPlayer?: string;
  selectedCard?: string;
  raidenEnemies?: string[];
};

export type GameUpgradeCardRequest = {
  action: "game.upgradeCard";
  cardId: string;
  card?: ECard;
};

export type GameUseBurstRequest = {
  action: "game.useBurst";
  character: ECharacter;
  selectedPlayer?: string;
  selectedEnemy?: string;
  selectedEnemies?: string[];
  divide?: { playerId: string; count: number }[];
  selectedCharacter?: ECharacter;
};

export type CharactersAddCharacterRequest = {
  action: "characters.addCharacter";
  character: ECharacter;
};

export type CharactersRemoveCharacterRequest = {
  action: "characters.removeCharacter";
  character: ECharacter;
};

export type TaskCompleteTaskRequest = {
  action: "task.completeTask";
  taskId: string;
};

export type GameDragonBreathResponseRequest =
  | { action: "game.dragonBreathResponse"; taskId: string; type: "none" }
  | { action: "game.dragonBreathResponse"; taskId: string; type: "dash"; cardId: string }
  | { action: "game.dragonBreathResponse"; taskId: string; type: "discard"; cardIds: string[] };

export type GameBossPassiveResponseRequest =
  | { action: "game.bossPassiveResponse"; taskId: string; type: "loseAP" }
  | { action: "game.bossPassiveResponse"; taskId: string; type: "discard"; cardIds: [string, string] };

export type AnyRequest =
  | GameStartRequest
  | GameEndTurnRequest
  | GameUseCardRequest
  | GameUpgradeCardRequest
  | GameUseBurstRequest
  | CharactersAddCharacterRequest
  | CharactersRemoveCharacterRequest
  | TaskCompleteTaskRequest
  | GameDragonBreathResponseRequest
  | GameBossPassiveResponseRequest;
