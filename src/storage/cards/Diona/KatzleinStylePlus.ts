import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class KatzleinStylePlus extends Card {
  public get Name(): string {
    return "KatzleinStylePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };

    if (ctx.player.Shields > 0) {
      attack.damage = 5;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
