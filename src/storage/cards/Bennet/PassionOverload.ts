import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class PassionOverload extends Card {
  public get Name(): string {
    return "PassionOverload";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 2,
      element: new Pyro(),
      player: ctx.player,
    };
    // TODO
  }
}
