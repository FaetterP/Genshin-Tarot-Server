import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class EdelBladework extends Card {
  public get Name(): string {
    return "EdelBladework";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (ctx.enemy.Shield > 0) {
      ctx.enemy.addShields(-1);
    } else {
      const attack: Attack = { damage: 2, player: ctx.player };
      ctx.enemy.applyAttack(attack);
    }

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      ctx.enemy.applyElement(new Cryo(), ctx.player);
    }
  }
}
