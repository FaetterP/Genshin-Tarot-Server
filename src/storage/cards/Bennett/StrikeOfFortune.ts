import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { StrikeOfFortunePlus } from "./StrikeOfFortunePlus";

export class StrikeOfFortune extends Card {
  public get Name(): ECard {
    return ECard.StrikeOfFortune;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return StrikeOfFortunePlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 2;
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);

    const attack: Attack = {
      damage,
      player: ctx.player,
    };
    target.applyAttack(attack);

    if (target.isContainsElement(EElement.Pyro)) {
      ctx.player.addEnergy(2);
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: 2,
        },
      ]);
    }
  }
}
