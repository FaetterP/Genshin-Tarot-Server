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
    const attack: Attack = { damage: 2, isRange: true, player: ctx.player };
    ctx.enemy.applyAttack(attack);

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Pyro().Name
      )
    ) {
      ctx.player.addActionPoints(1);
    }
  }
}
