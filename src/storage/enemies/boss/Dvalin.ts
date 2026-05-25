import { ECard, ECardType, EDetailedStep, EDvalinAttack, EElement, EEnemy, ELeyline } from "../../../types/enums";
import { BossEnemy, LeylineEntry } from "../BossEnemy";
import { BaseElement } from "../../elements/BaseElement";
import { Player } from "../../../game/Player";
import { getRandomElement } from "../../../utils/arrays";
import { DvalinLeylines } from "./DvalinLeylines";
import { sendToAllAndWait, sendToEachAndWait } from "../../../utils/wsUtils";
import { GameDragonBreathResponse } from "../../../types/response";
import { Card } from "../../cards/Card";
import type { DetailedStep } from "../../../types/detailedStep";

type DragonBreathChoice = {
  type: "dash" | "discard" | "none";
  cardId?: string;
  cardIds?: string[];
};

type BossPassiveChoice = {
  type: "discard" | "loseAP";
  cardIds?: string[];
};

export class Dvalin extends BossEnemy {
  private pendingDragonBreathChoices: Map<string, DragonBreathChoice> | null = null;
  private pendingBossPassiveChoices: Map<string, BossPassiveChoice> | null = null;
  protected override readonly leylinePool = DvalinLeylines;

  constructor(playerCount: number) {
    super(Dvalin.prototype.getStatsByPlayers(playerCount));
  }

  public get Name(): EEnemy {
    return EEnemy.Dvalin;
  }

  public getStatsByPlayers(playerCount: number) {
    const stats: Record<number, { lives: number; hp: number; shield: number }> = {
      1: { lives: 2, hp: 15, shield: 2 },
      2: { lives: 3, hp: 15, shield: 2 },
      3: { lives: 4, hp: 16, shield: 3 },
      4: { lives: 5, hp: 18, shield: 3 },
    };
    return stats[playerCount] ?? stats[1];
  }

  public override applyElement(element: BaseElement, player: Player): void {
    if (element.Name === EElement.Anemo) {
      player.addSteps([{ type: EDetailedStep.BossAnemoImmunity, bossId: this.ID }]);
      return;
    }
    super.applyElement(element, player);
  }

  public override getCycleLeylines(cycle: number): LeylineEntry[] {
    let count: number;
    if (cycle <= 2) count = 0;
    else if (cycle <= 5) count = 1;
    else if (cycle <= 8) count = 2;
    else count = 3;

    const result: LeylineEntry[] = [];
    for (let i = 0; i < count; i++) {
      result.push(getRandomElement(this.leylinePool));
    }
    return result;
  }

  public override receivePlayerAction(actionName: string, playerId: string, payload: Record<string, any>): void {
    if (actionName === "dragonBreath") {
      this.pendingDragonBreathChoices?.set(playerId, {
        type: payload["type"] || "none",
        cardId: payload["cardId"],
        cardIds: payload["cardIds"],
      });
    } else if (actionName === "bossPassive") {
      this.pendingBossPassiveChoices?.set(playerId, {
        type: payload["type"] || "loseAP",
        cardIds: payload["cardIds"],
      });
    }
  }

  public override async performOnStartCycle(players: Player[], addToSteps: (steps: DetailedStep[]) => void): Promise<void> {
    const choices = new Map<string, BossPassiveChoice>();
    this.pendingBossPassiveChoices = choices;

    await sendToEachAndWait((ws) => ({
      action: "game.bossPassive",
      hand: ws.player.Hand.map((c) => c.getPrimitive()),
    }));

    const VALID_TYPES = [ECardType.Attack, ECardType.Skill];
    for (const player of players) {
      const choice = choices.get(player.ID);
      let avoided = false;

      if (choice?.type === "discard" && choice.cardIds && choice.cardIds.length >= 2) {
        const toDiscard = choice.cardIds
          .slice(0, 2)
          .map((id) => player.Hand.find((c) => c.ID === id))
          .filter((c): c is Card => c != null && VALID_TYPES.includes(c.Type));

        if (toDiscard.length === 2) {
          for (const card of toDiscard) {
            player.discardCard(card);
            addToSteps([{
              type: EDetailedStep.MoveCard,
              to: "discard",
              playerId: player.ID,
              card: card.getPrimitive(),
            }]);
          }
          avoided = true;
        }
      }

      if (!avoided) {
        player.trySpendActonPoints(1);
        addToSteps([{
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: player.ID,
          delta: -1,
        }]);
      }
    }

    this.pendingBossPassiveChoices = null;
  }

  public override async performAttack(players: Player[], addToSteps: (steps: DetailedStep[]) => void): Promise<void> {
    const roll = this.nextRollOverride ?? Math.floor(Math.random() * 6) + 1;
    this.nextRollOverride = null;

    if (roll <= 3) {
      addToSteps([{ type: EDetailedStep.BossAttack, bossId: this.ID, attackName: EDvalinAttack.SwoopingStrike }]);
      this.applyDamageToAll(players, 4, false, addToSteps);

    } else if (roll <= 5) {
      addToSteps([{ type: EDetailedStep.BossAttack, bossId: this.ID, attackName: EDvalinAttack.PulsingWind }]);
      this.applyDamageToAll(players, 3, false, addToSteps);
      for (const player of players) {
        const count = Math.min(2, player.Hand.length);
        for (let i = 0; i < count; i++) {
          const card = getRandomElement([...player.Hand]);
          player.discardCard(card);
          addToSteps([{
            type: EDetailedStep.MoveCard,
            to: "discard",
            playerId: player.ID,
            card: card.getPrimitive(),
          }]);
        }
      }

    } else {
      addToSteps([{ type: EDetailedStep.BossAttack, bossId: this.ID, attackName: EDvalinAttack.DragonBreath }]);
      const choices = new Map<string, DragonBreathChoice>();
      this.pendingDragonBreathChoices = choices;

      await sendToAllAndWait<GameDragonBreathResponse>({
        action: "game.dragonBreath",
        bossId: this.ID,
      });

      for (const player of players) {
        const choice = choices.get(player.ID);
        let avoided = false;

        if (choice?.type === "dash" && choice.cardId) {
          const dashCard = player.Hand.find((c) => c.ID === choice.cardId && c.Name === ECard.Dash);
          if (dashCard) {
            player.setStepsCollector(addToSteps);
            player.trashCardById(dashCard.ID);
            player.setStepsCollector(null);
            avoided = true;
          }
        } else if (choice?.type === "discard" && choice.cardIds && choice.cardIds.length >= 4) {
          const validCards = choice.cardIds
            .slice(0, 4)
            .map((id) => player.Hand.find((c) => c.ID === id))
            .filter((c): c is Card => c != null);

          if (validCards.length === 4) {
            for (const card of validCards) {
              player.discardCard(card);
              addToSteps([{
                type: EDetailedStep.MoveCard,
                to: "discard",
                playerId: player.ID,
                card: card.getPrimitive(),
              }]);
            }
            avoided = true;
          }
        }

        if (!avoided) {
          player.applyDamage(4, true);
          addToSteps([{
            type: EDetailedStep.PlayerTakeDamage,
            playerId: player.ID,
            damage: 4,
            isPiercing: true,
            enemyId: this.ID,
          }]);
        }

        addToSteps([{
          type: EDetailedStep.EnemyAttack,
          enemyId: this.ID,
          playerId: player.ID,
          damage: 4,
        }]);
      }

      this.pendingDragonBreathChoices = null;
    }
  }
}
