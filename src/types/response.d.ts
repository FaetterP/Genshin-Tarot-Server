import type { DetailedStep } from "./detailedStep";
import type { PlayerPrimitive } from "./general";

export type OkResponse = {
  status: "ok";
}

export type ErrorResponse = {
  status: "error";
  message: string;
}

export type AwaitedResponse<T extends AnyResponse> = T & {
  taskId: string;
}

export interface WsConnectResponse {
  action: "ws.connect";
  youPlayerId: string;
}

export interface GameStartGameResponse {
  action: "game.startGame";
}

export type GameEndTurnResponse = {
  action: "game.endTurn";
  playerID: string;
  steps: DetailedStep[];
};

export interface GameStartCycleResponse {
  action: "game.startCycle";
  you: PlayerPrimitive | undefined;
  otherPlayers: PlayerPrimitive[];
  cycle: number;
  leylines: string[];
  steps: DetailedStep[];
}

export interface GameEndCycleResponse {
  action: "game.endCycle";
  steps: DetailedStep[];
}

export interface GameUseCardResponse {
  action: "game.useCard";
  cardId: string;
  player: PlayerPrimitive;
  steps: DetailedStep[];
}

export interface GameUpgradeCardResponse {
  action: "game.upgradeCard";
  cardId: string;
  player: PlayerPrimitive;
  steps: DetailedStep[];
}

export interface GameUseBurstResponse {
  action: "game.useBurst";
  character: string;
  player: PlayerPrimitive;
  steps: DetailedStep[];
}

export interface CharactersAddCharacterResponse {
  action: "characters.addCharacter";
  player: string;
  character: string;
}

export interface CharactersRemoveCharacterResponse {
  action: "characters.removeCharacter";
  player: string;
  character: string;
}

export type AnyResponse =
  | WsConnectResponse
  | GameStartGameResponse
  | GameStartCycleResponse
  | GameUseCardResponse
  | GameEndTurnResponse
  | GameEndCycleResponse
  | GameUpgradeCardResponse
  | GameUseBurstResponse
  | CharactersAddCharacterResponse
  | CharactersRemoveCharacterResponse;
