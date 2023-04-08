import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class StellarRestorationPlus extends Card {
  public get Name(): string {
    return "StellarRestorationPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = [...ctx.enemies, ...ctx.enemies, ...ctx.enemies];
    enemies.length = 3;

    for (let i = 0; i < 3; i++) {
      ctx.enemies[0].applyElement(new Electro(), ctx.player);
    }

    ctx.player.addEnergy(2);
  }
}
