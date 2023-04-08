import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class WeissBladework extends Card {
  public get Name(): string {
    return "WeissBladework";
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
        new Geo().Name
      )
    ) {
      ctx.player.addEnergy(2);
    }
  }
}
