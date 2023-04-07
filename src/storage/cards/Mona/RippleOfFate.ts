import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class RippleOfFate extends Card {
  public get Name(): string {
    return "RippleOfFate";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Hydro(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    ctx.player.drawCard();
  }
}
