import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class FireworkFlareUp extends Card {
  public get Name(): string {
    return "FireworkFlareUp";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = { damage: 2, isRange: true, player: ctx.player };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.enemies[0].isContainsElement(new Pyro())) {
      ctx.player.addActionPoints(1);
    }
  }
}
