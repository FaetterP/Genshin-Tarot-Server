import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class GuhuaStylePlus extends Card {
  public get Name(): string {
    return "GuhuaStylePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = { damage: 3, player: ctx.player };

    if (
      ctx.enemies[0].Elements.map((element) => element.Name).includes(
        new Hydro().Name
      )
    ) {
      attack.damage = 5;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
