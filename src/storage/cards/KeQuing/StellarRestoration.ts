import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class StellarRestoration extends Card {
  public get Name(): string {
    return "StellarRestoration";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Electro(), ctx.player);
  }
}
