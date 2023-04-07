import { CardUseContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class Chihayaburu extends Card {
  public get Name(): string {
    return "Chihayaburu";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Anemo(), ctx.player)
    // TODO
  }
}
