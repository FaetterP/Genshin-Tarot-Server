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
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    
    const attack: Attack = { damage: 2, player: ctx.player };
    ctx.enemies[0].applyAttack(attack);

    if (
      ctx.enemies[0].Elements.map((element) => element.Name).includes(
        new Hydro().Name
      )
    ) {
      ctx.player.addEnergy(2);
    }
  }
}
