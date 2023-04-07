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
    const attack: Attack = {
      damage: 3,
      element: new Anemo(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    ctx.player.addEnergy(2);
  }
}
