import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { LiutianArcheryPlus } from "./LiutianArcheryPlus";

export class LiutianArchery extends Card {
  public get Name(): ECard {
    return ECard.LiutianArchery;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  get Upgrade() {
    return LiutianArcheryPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let element: EElement | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = EElement.Cryo;
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: -1,
        },
        { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Cryo },
      ]);
    }
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element,
      },
    ]);
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    if (element) attack.element = new Cryo();
    target.applyAttack(attack);
  }
}
