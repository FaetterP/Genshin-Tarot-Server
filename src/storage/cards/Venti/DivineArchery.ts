import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class DivineArchery extends Card {
  public get Name(): string {
    return "DivineArchery";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      attack.element = new Anemo();
    }

    ctx.enemy.applyAttack(attack);
  }
}
