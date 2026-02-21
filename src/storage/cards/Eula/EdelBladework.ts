import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { EdelBladeworkPlus } from "./EdelBladeworkPlus";

export class EdelBladework extends Card {
  public get Name(): ECard {
    return ECard.EdelBladework;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return EdelBladeworkPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    if (target.Shield > 0) {
      ctx.addToSteps([{ type: EDetailedStep.EnemyChangeShield, enemyId: target.ID, delta: -1 }]);
      target.addShields(-1);
    } else {
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: target.ID,
          damage: 2,
          isPiercing: false,
        },
      ]);
      target.applyAttack({ damage: 2, player: ctx.player });
    }

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      ctx.addToSteps([
        { type: EDetailedStep.PlayerChangeEnergy, playerId: ctx.player.ID, delta: -2 },
        { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Cryo },
      ]);
      target.applyElement(new Cryo(), ctx.player);
    }
  }
}
