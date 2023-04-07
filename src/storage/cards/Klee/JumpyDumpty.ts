import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class JumpyDumpty extends Card {
  public get Name(): string {
    return "JumpyDumpty";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      element: new Pyro(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);
    // TODO attack two enemies
    // TODO place card to top of deck
  }
}
