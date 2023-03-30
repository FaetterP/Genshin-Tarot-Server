import { ExtWebSocket } from "../../../types/wsTypes";
import { AttackCard } from "../../storage/cards/AttackCard";
import { UseableCard } from "../../storage/cards/UseableCard";

async function startGame(ws: ExtWebSocket, payload: any) {
  ws.cycleController.startGame();
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
}

export default { handlers: { startGame, attackCard, useCard } };
