import { getAllClients, getAllPlayers } from "..";
import { CardUseContext } from "../../../types/functionsContext";
import { EnemyPrimitive, PlayerPrimitive } from "../../../types/general";
import { ExtWebSocket } from "../../../types/wsTypes";
import { Card } from "../../storage/cards/Card";
import { TaskAwaiter } from "../../utils/TaskAwaiter";
import { sendToAll, sendToAllAndWait } from "../../utils/wsUtils";

async function startGame(ws: ExtWebSocket, payload: any) {
  ws.cycleController.startGame();
  await sendToAllAndWait({ action: "game.startGame" });

  ws.cycleController.startCycle();
}

async function endTurn(ws: ExtWebSocket, payload: any) {
  ws.cycleController.playerEndTurn(ws.player);
}

async function useCard(ws: ExtWebSocket, payload: any) {
  const {
    cardId,
    enemies: enemiesId,
    isUseAlternative,
    selectedPlayer: selectedPlayerId,
  } = payload as {
    cardId: string;
    enemies?: string[];
    isUseAlternative?: boolean;
    selectedPlayer?: string;
  };

  const card = ws.cycleController.getPlayerCard(cardId, ws.player);
  if (!card) {
    throw new Error("card not found");
  }

  if (card instanceof Card === false) {
    throw new Error("card not Card");
  }

  const enemies = enemiesId
    ? enemiesId.map((id) => ws.cycleController.getEnemyById(id)!)
    : undefined;

  const selectedPlayer = selectedPlayerId
    ? ws.cycleController.getPlayerById(selectedPlayerId)!
    : undefined;

  const ctx: CardUseContext = {
    player: ws.player,
    isUseAlternative,
    enemies,
    selectedPlayer,
  };

  if (!ws.player.trySpendActonPoints(card.Cost))
    throw new Error(
      `not enough action points you:${ws.player.ActionPoints.total} need:${card.Cost}`
    );

  card.use(ctx);
  ws.player.discardCard(card);
  // TODO move discard to card.use

  for (const player of getAllPlayers()) {
    const ret = {
      action: "game.useCard",
      cardId: card.ID,
      player: player.getPrimitiveStats(),
    };
    sendToAll(ret);
  }
}

export default { handlers: { startGame, useCard, endTurn } };
