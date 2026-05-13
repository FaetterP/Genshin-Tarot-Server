import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { BoltsOfDownfallPlus } from "./BoltsOfDownfallPlus";

export class BoltsOfDownfall extends Card {
  public get Name(): ECard {
    return ECard.BoltsOfDownfall;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  get Upgrade() {
    return BoltsOfDownfallPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let element: EElement | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = EElement.Electro;
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: -1,
        },
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
    if (element) attack.element = new Electro();
    target.applyAttack(attack);
  }
}
