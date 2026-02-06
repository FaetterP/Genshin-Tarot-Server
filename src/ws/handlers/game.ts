import type { DetailedStep } from "../../types/detailedStep";
import { CardUseContext, CharacterUseBurstContext } from "../../types/functionsContext";
import { ExtWebSocket } from "../../types/wsTypes";
import { Card } from "../../storage/cards/Card";
import { sendToAll, sendToAllAndWait } from "../../utils/wsUtils";
import { GameUpgradeCardRequest, GameUseBurstRequest, GameUseCardRequest } from "../../types/request";
import { GameUpgradeCardResponse, GameUseBurstResponse, GameUseCardResponse } from "../../types/response";

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
  } = payload as GameUseCardRequest;

  const card = ws.cycleController.getPlayerCard(cardId, ws.player);
  if (!card) {
    throw new Error("card not found");
  }

  if (card instanceof Card === false) {
    throw new Error("card not Card");
  }

  if (card.Name === "Burn") {
    throw new Error("Burn card cannot be used");
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

  if (ws.player.ActionPoints.total < card.Cost)
    throw new Error(
      `not enough action points you:${ws.player.ActionPoints.total} need:${card.Cost}`
    );

  card.use(ctx);

  ws.player.trySpendActonPoints(card.Cost);
  steps.push({
    type: "player_change_action_points",
    playerId: ws.player.ID,
    delta: -card.Cost,
  });

  if (ws.player.Hand.some((c) => c.ID === card.ID)) {
    steps.push({
      type: "discard_card",
      playerId: ws.player.ID,
      card: { cardId: card.ID, name: card.Name },
    });
    ws.player.discardCard(card);
  }
  ws.player.setStepsCollector(null);

  sendToAll<GameUseCardResponse>({
    action: "game.useCard",
    cardId: card.ID,
    player: ws.player.getPrimitiveStats(),
    steps,
  });
}

const UPGRADE_MORA_COST = 5;

async function upgradeCard(ws: ExtWebSocket, payload: any) {
  const { cardId } = payload as GameUpgradeCardRequest;

  const card = ws.cycleController.getPlayerCard(cardId, ws.player);
  if (!card) {
    throw new Error("card not found");
  }
  if (!card.Upgrade) {
    throw new Error("this card cannot be upgraded");
  }
  if (ws.player.Mora < UPGRADE_MORA_COST) {
    throw new Error(`not enough mora: need ${UPGRADE_MORA_COST}, have ${ws.player.Mora}`);
  }

  ws.player.trySpendMora(UPGRADE_MORA_COST);
  const oldCardPrimitive = { cardId: card.ID, name: card.Name };
  ws.player.removeCardFromHand(card);

  const UpgradedCard = card.Upgrade;
  const newCard = new UpgradedCard();
  ws.player.addCardToHand(newCard);

  const steps: DetailedStep[] = [
    { type: "player_change_mora", playerId: ws.player.ID, delta: -UPGRADE_MORA_COST },
    {
      type: "add_card",
      playerId: ws.player.ID,
      card: { cardId: newCard.ID, name: newCard.Name },
      to: "hand",
    },
    {
      type: "upgrade_card",
      playerId: ws.player.ID,
      oldCard: oldCardPrimitive,
      newCard: { cardId: newCard.ID, name: newCard.Name },
    },
  ];

  sendToAll<GameUpgradeCardResponse>({
    action: "game.upgradeCard",
    cardId,
    player: ws.player.getPrimitiveStats(),
    steps,
  });
}

async function useBurst(ws: ExtWebSocket, payload: any) {
  const {
    character: characterName,
    selectedPlayer: selectedPlayerId,
    selectedEnemy: selectedEnemyId,
    selectedEnemies: selectedEnemiesIds,
    divide,
    selectedCharacter: selectedCharacterName,
  } = payload as GameUseBurstRequest;

  if (!characterName) {
    throw new Error("character is required");
  }

  const character = ws.player.Characters.find((c) => c.Name === characterName);
  if (!character) {
    throw new Error("character not found");
  }

  const steps: DetailedStep[] = [];
  const addToSteps = (data: DetailedStep[]) => steps.push(...data);
  ws.player.setStepsCollector(addToSteps);

  const allPlayers = ws.cycleController.getPlayers();
  const selectedPlayer = selectedPlayerId
    ? ws.cycleController.getPlayerById(selectedPlayerId)
    : undefined;
  const selectedEnemy = selectedEnemyId
    ? ws.cycleController.getEnemyById(selectedEnemyId)
    : undefined;
  const selectedEnemies = selectedEnemiesIds
    ? selectedEnemiesIds.map((id) => ws.cycleController.getEnemyById(id)!)
    : undefined;
  const divideResolved = divide?.map(({ playerId, count }) => ({
    player: ws.cycleController.getPlayerById(playerId)!,
    count,
  }));
  const selectedCharacter = selectedCharacterName
    ? allPlayers.flatMap((p) => [...p.Characters]).find((c) => c.Name === selectedCharacterName)
    : undefined;

  const ctx: CharacterUseBurstContext = {
    character,
    player: ws.player,
    allPlayers,
    addToSteps,
    selectedEnemy,
    selectedPlayer,
    divide: divideResolved,
    selectedCharacter,
    selectedEnemies,
  };

  if (!character.tryUseBurst(ctx)) {
    ws.player.setStepsCollector(null);
    throw new Error(
      `not enough energy: need ${character.BurstCost}, have ${ws.player.Energy}`
    );
  }

  steps.unshift({
    type: "player_change_energy",
    playerId: ws.player.ID,
    delta: -character.BurstCost,
  });

  ws.player.setStepsCollector(null);

  sendToAll<GameUseBurstResponse>({
    action: "game.useBurst",
    character: characterName,
    player: ws.player.getPrimitiveStats(),
    steps,
  });
}

export default { handlers: { startGame, useCard, endTurn, upgradeCard, useBurst } };
