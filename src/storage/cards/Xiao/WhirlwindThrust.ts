import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class WhirlwindThrust extends Card {
  public get Name(): string {
    return "WhirlwindThrust";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      const attack: Attack = {
        damage: 1,
        isPiercing: true,
        player: ctx.player,
      };
      // TODO
    }
  }
}
