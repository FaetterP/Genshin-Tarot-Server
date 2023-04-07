import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class RainOfStone extends Card {
  public get Name(): string {
    return "RainOfStone";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Geo(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      ctx.player.addActionPoints(1);
    }
  }
}
