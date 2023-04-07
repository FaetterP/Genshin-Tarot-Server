import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SharpshooterPlus extends Card {
  public get Name(): string {
    return "SharpshooterPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      player: ctx.player,
      isRange: true,
      isPiercing: true,
    };

    if (ctx.enemies[0].Shield === 0) {
      attack.damage = 3;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
