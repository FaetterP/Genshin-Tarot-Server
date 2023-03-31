import { getAllClients } from "..";
import { ExtWebSocket } from "../../../types/wsTypes";
import { AttackCard } from "../../storage/cards/AttackCard";
import { UseableCard } from "../../storage/cards/UseableCard";
import { sendToAllAndWait } from "../../utils/wsUtils";

type EnemyReturn = {
  name: string;
  hp: number;
  shield: number;
  elements: string[];
};

type PlayerReturn = {
  playerId: string;
  hp: number;
  wave: number;
  enemies: EnemyReturn[];
};

async function startGame(ws: ExtWebSocket, payload: any) {
  ws.cycleController.startGame();
  await sendToAllAndWait({ action: "game.startGame" });

  ws.cycleController.startCycle();
  const ret: {
    cycle: number;
    players: PlayerReturn[];
  } = {
    cycle: ws.cycleController.CycleNumber,
    players: [],
  };

  for (const ws of getAllClients()) {
    const player = (ws as ExtWebSocket).player;
    const playerInfo: PlayerReturn = {
      playerId: player.ID,
      hp: player.Health,
      wave: player.Wave,
      enemies: [],
    };

    for (const enemy of player.Enemies) {
      const enemyInfo: EnemyReturn = {
        name: enemy.Name,
        hp: enemy.Health,
        shield: enemy.Shield,
        elements: [],
      };

      for (const element of enemy.Elements) {
        enemyInfo.elements.push(element.Name);
      }

      playerInfo.enemies.push(enemyInfo);
    }

    ret.players.push(playerInfo);
  }

  await sendToAllAndWait({ ...ret, action: "game.startCycle" });
}

async function endTurn(ws: ExtWebSocket, payload: any) {
  ws.cycleController.playerEndTurn(ws.player);
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

export default { handlers: { startGame, attackCard, useCard, endTurn } };
