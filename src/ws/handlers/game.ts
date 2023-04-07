import { getAllClients } from "..";
import { CardUseContext } from "../../../types/functionsContext";
import { PlayerPrimitive } from "../../../types/general";
import { ExtWebSocket } from "../../../types/wsTypes";
import { Card } from "../../storage/cards/Card";
import { SmallCryoSlime } from "../../storage/enemies/normal/SmallCryoSlime";
import { sendToAll, sendToAllAndWait } from "../../utils/wsUtils";

async function startGame(ws: ExtWebSocket, payload: any) {
  ws.cycleController.startGame();
  await sendToAllAndWait({ action: "game.startGame" });

  ws.cycleController.startCycle();
  const ret: {
    cycle: number;
    players: PlayerPrimitive[];
  } = {
    cycle: ws.cycleController.CycleNumber,
    players: [],
  };

  for (const ws of getAllClients()) {
    const player = (ws as ExtWebSocket).player;
    ret.players.push(player.getPrimitiveStats());
  }

  await sendToAllAndWait({ ...ret, action: "game.startCycle" });
}

async function endTurn(ws: ExtWebSocket, payload: any) {
  ws.cycleController.playerEndTurn(ws.player);

  const ret = { action: "game.endTurn", player: ws.player.ID };
  sendToAll(ret);
}

async function useCard(ws: ExtWebSocket, payload: any) {
  const { cardId } = payload as { cardId: string };

  const card = ws.cycleController.getPlayerCard(cardId, ws.player);
  if (!card) {
    throw new Error("card not found");
  }

  if (card instanceof Card === false) {
    throw new Error("card not Card");
  }

  const ctx: CardUseContext = {
    player: ws.player,
  };
  card.use(ctx);

  const ret = {
    action: "game.useCard",
    cardId: card.ID,
    player: ws.player.getPrimitiveStats(),
  };
  sendToAll(ret);
}

export default { handlers: { startGame, useCard, endTurn } };
