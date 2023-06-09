import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class RavagingConfessionPlus extends Card {
  public get Name(): string {
    return "RavagingConfessionPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 3,
      isRange: true,
      element: new Cryo(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    // TODO
  }
}
