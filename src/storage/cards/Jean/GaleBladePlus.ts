import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class GaleBladePlus extends Card {
  public get Name(): string {
    return "GaleBladePlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);
  }
}
