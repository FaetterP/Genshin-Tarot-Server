import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class GuhuaStyle extends Card {
  public get Name(): string {
    return "GuhuaStyle";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Hydro().Name
      )
    ) {
      ctx.player.addEnergy(2);
    }

    const attack: Attack = { damage: 2, player: ctx.player };
    ctx.enemy.applyAttack(attack);
  }
}
