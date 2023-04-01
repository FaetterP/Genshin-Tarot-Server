import { getAllClients } from "..";
import { PlayerPrimitive } from "../../../types/general";
import { ExtWebSocket } from "../../../types/wsTypes";
import { AttackCard } from "../../storage/cards/AttackCard";
import { UseableCard } from "../../storage/cards/UseableCard";
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

async function attackCard(ws: ExtWebSocket, payload: any) {
  const { enemyId, cardId } = payload as { enemyId: string; cardId: string };
  const enemy = ws.cycleController.getEnemyById(enemyId);
  if (!enemy) {
    throw new Error("enemy not found");
  }

  const card = ws.cycleController.getPlayerCard(cardId, ws.player);
  if (!card) {
    throw new Error("card not found");
  }

  if (card instanceof AttackCard === false) {
    throw new Error("card not AttackCard");
  }

  const attackCard = card as AttackCard;

  const ctx = { attacker: ws.player, enemy };
  attackCard.attack(ctx);

  const ret = {
    action: "game.attackCard",
    player: ws.player.getPrimitiveStats(),
    card: attackCard.ID,
    enemy: enemy.getPrimitiveStats(),
  };

  sendToAll(ret);
}

async function useCard(ws: ExtWebSocket, payload: any) {
  const { cardId } = payload as { cardId: string };

  const card = ws.cycleController.getPlayerCard(cardId, ws.player);
  if (!card) {
    throw new Error("card not found");
  }

  if (card instanceof UseableCard === false) {
    throw new Error("card not UseableCard");
  }

  const useableCard = card as UseableCard;

  const ctx = { player: ws.player };
  useableCard.use(ctx);

  const ret = {
    action: "game.useCard",
    cardId: card.ID,
    player: ws.player.getPrimitiveStats(),
  };
  sendToAll(ret);
}

export default { handlers: { startGame, attackCard, useCard, endTurn } };
