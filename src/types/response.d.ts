import type { DetailedStep } from "./detailedStep";
import type { PlayerPrimitive } from "./general";

export type ServerActionResult<T = unknown> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string };

export interface WsConnectResponse {
  action: "ws.connect";
  youPlayerId: string;
}

export interface GameStartGameResponse {
  action: "game.startGame";
}

export type GameEndTurnResponse = {
  action: "game.endTurn",
  playerID: string
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


export type AnyResponse = WsConnectResponse
  | GameStartGameResponse
  | GameUseCardResponse
  | GameEndTurnResponse
  | GameUpgradeCardResponse
  | GameUseBurstResponse
  | CharactersAddCharacterResponse
  | CharactersRemoveCharacterResponse