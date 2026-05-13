import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class LiutianArcheryPlus extends Card {
  public get Name(): ECard {
    return ECard.LiutianArcheryPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let damage = 2;
    let element: EElement | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      element = EElement.Cryo;
      damage *= 3;
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: -2,
        },
      ]);
      ctx.addToSteps([
        { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Cryo },
      ]);
    }
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element,
      },
    ]);
    const attack: Attack = {
      damage,
      isRange: true,
      player: ctx.player,
    };
    if (element) attack.element = new Cryo();
    target.applyAttack(attack);
  }
}
