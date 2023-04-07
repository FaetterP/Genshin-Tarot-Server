import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class Nightrider extends Card {
  public get Name(): string {
    return "Nightrider";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      element: new Electro(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
