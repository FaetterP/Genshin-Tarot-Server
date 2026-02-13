import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { DivineArcheryPlus } from "./DivineArcheryPlus";

export class DivineArchery extends Card {
  public get Name(): string {
    return "DivineArchery";
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  get Upgrade() {
    return DivineArcheryPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let element: EElement | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = EElement.Anemo;
    }
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
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
    if (element) attack.element = new Anemo();
    target.applyAttack(attack);
  }
}
