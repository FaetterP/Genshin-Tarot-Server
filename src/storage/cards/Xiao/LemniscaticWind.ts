import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class LemniscaticWind extends Card {
  public get Name(): string {
    return "LemniscaticWind";
  }

  constructor() {
    super(1);
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
