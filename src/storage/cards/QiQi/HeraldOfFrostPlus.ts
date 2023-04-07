import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class HeraldOfFrostPlus extends Card {
  public get Name(): string {
    return "HeraldOfFrostPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.player);
    // TODO следующий, кто ударит этого же врага, отрегенит 3 хп и 2 энергии
  }
}
