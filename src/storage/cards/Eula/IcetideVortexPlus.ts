import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class IcetideVortexPlus extends Card {
  public get Name(): string {
    return "IcetideVortexPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.player);
    // TODO
  }
}
