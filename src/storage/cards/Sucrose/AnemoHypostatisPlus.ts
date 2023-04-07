import { CardUseContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class AnemoHypostatisPlus extends Card {
  public get Name(): string {
    return "AnemoHypostatisPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Anemo(), ctx.player);
    // TODO
  }
}
