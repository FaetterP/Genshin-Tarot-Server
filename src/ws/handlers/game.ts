import type { DetailedStep } from "../../../types/detailedStep";
import { CardUseContext } from "../../../types/functionsContext";
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

  const steps: DetailedStep[] = [];
  const ctx: CardUseContext = {
    player: ws.player,
    isUseAlternative,
    enemies,
    selectedPlayer,
    addToSteps: (data) => steps.push(...data),
  };
  ws.player.setStepsCollector((data) => steps.push(...data));

  if (!ws.player.trySpendActonPoints(card.Cost))
    throw new Error(
      `not enough action points you:${ws.player.ActionPoints.total} need:${card.Cost}`
    );

  steps.push({
    type: "player_change_action_points",
    playerId: ws.player.ID,
    delta: -card.Cost,
  });

  card.use(ctx);

  steps.push({
    type: "discard_card",
    playerId: ws.player.ID,
    card: { cardId: card.ID, name: card.Name },
  });
  ws.player.discardCard(card);
  ws.player.setStepsCollector(null);
  // TODO move discard to card.use

  const ret = {
    action: "game.useCard",
    cardId: card.ID,
    player: ws.player.getPrimitiveStats(),
    steps,
  };
  sendToAll(ret);
}

export default { handlers: { startGame, useCard, endTurn } };
