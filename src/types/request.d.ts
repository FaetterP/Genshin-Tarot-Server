export type GameStartRequest = { action: "game.startGame" }

export type GameEndTurnRequest = { action: "game.endTurn" }

export type GameUseCardRequest = {
  action: "game.useCard"
  cardId: string;
  enemies?: string[];
  isUseAlternative?: boolean;
  selectedPlayer?: string;
}

export type GameUpgradeCardRequest = {
  action: "game.upgradeCard"
  cardId: string;
}

export type GameUseBurstRequest = {
  action: "game.useBurst"
  character: string;
  selectedPlayer?: string;
  selectedEnemy?: string;
  selectedEnemies?: string[];
  divide?: { playerId: string; count: number }[];
  selectedCharacter?: string;
}

export type CharactersAddCharacterRequest = {
  action: "characters.addCharacter"
  character: string;
}

export type CharactersRemoveCharacterRequest = {
  action: "characters.removeCharacter"
  character: string;
}

export type TaskCompleteTaskRequest = {
  action: "task.completeTask"
  taskId: string;
}
