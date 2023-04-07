import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class IcetideVortex extends Card {
  public get Name(): string {
    return "IcetideVortex";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.player);
    // TODO
  }
}
