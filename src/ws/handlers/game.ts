import { getAllClients } from "..";
import { CardUseContext } from "../../../types/functionsContext";
import { EnemyPrimitive, PlayerPrimitive } from "../../../types/general";
import { ExtWebSocket } from "../../../types/wsTypes";
import { Card } from "../../storage/cards/Card";
import { sendToAll, sendToAllAndWait } from "../../utils/wsUtils";

async function startGame(ws: ExtWebSocket, payload: any) {
  ws.cycleController.startGame();
  await sendToAllAndWait({ action: "game.startGame" });
  
  startCycle(ws);
}

async function startCycle(ws: ExtWebSocket) {
  ws.cycleController.startCycle();
  const ret: {
    you?: PlayerPrimitive;
    cycle: number;
    otherPlayers: PlayerPrimitive[];
  } = {
    cycle: ws.cycleController.CycleNumber,
    otherPlayers: [],
  };

  for (const ws of getAllClients()) {
    const player = (ws as ExtWebSocket).player;
    ret.otherPlayers.push(player.getPrimitiveStats());
  }

  for (const ws of getAllClients()) {
    const data = { ...ret, action: "game.startCycle" };
    const you = (ws as ExtWebSocket).player;
    data.you = you.getPrimitiveStats();
    data.otherPlayers = data.otherPlayers.filter(
      (player) => player.playerId !== data.you?.playerId
    );
    ws.send(JSON.stringify(data));
  }
}

async function endTurn(ws: ExtWebSocket, payload: any) {
  const ret = { action: "game.endTurn", player: ws.player.ID };
  sendToAll(ret);
  ws.cycleController.playerEndTurn(ws.player);

  startCycle(ws);
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

  const ret = {
    action: "game.useCard",
    cardId: card.ID,
    player: ws.player.getPrimitiveStats(),
  };
  sendToAll(ret);
}

export default { handlers: { startGame, useCard, endTurn } };
