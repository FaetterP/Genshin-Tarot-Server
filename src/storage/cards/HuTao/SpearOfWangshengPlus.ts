import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SpearOfWangsheng extends Card {
  public get Name(): string {
    return "SpearOfWangsheng";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    ctx.player.applyDamage(1);

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      player: ctx.player,
    };

    if (ctx.player.Health <= 7) {
      attack.damage = 4;
    }

    // TODO 

    ctx.enemies[0].applyAttack(attack);
  }
}
