import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class BoltsOfDownfall extends Card {
  public get Name(): string {
    return "BoltsOfDownfall";
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
      attack.element = new Electro();
    }

    ctx.enemy.applyAttack(attack);
  }
}
