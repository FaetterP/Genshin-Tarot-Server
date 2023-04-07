import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class LemniscaticWindPlus extends Card {
  public get Name(): string {
    return "LemniscaticWindPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    };
    // if last played card is Dash, 5 damage
    ctx.enemy.applyAttack(attack);
  }
}
