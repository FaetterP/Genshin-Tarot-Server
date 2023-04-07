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
    ctx.enemy.applyElement(new Electro(), ctx.player);
    // TODO attack extra 2 enemies

    ctx.player.addEnergy(2);
  }
}
