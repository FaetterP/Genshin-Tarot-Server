import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class ForeignIronwindPlus extends Card {
  public get Name(): string {
    return "ForeignIronwindPlus";
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
      element: new Anemo(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    ctx.player.addEnergy(2);
  }
}
