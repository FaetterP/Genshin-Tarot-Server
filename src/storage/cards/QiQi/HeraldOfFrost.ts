import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class HeraldOfFrost extends Card {
  public get Name(): string {
    return "HeraldOfFrost";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.player);
    // TODO следующий, кто ударит этого же врага, отрегенит 2 хп
  }
}
