import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SearingOnslaughtPlus extends Card {
  public get Name(): string {
    return "SearingOnslaughtPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (let i = 0; i < 3; i++) {
      const attack: Attack = {
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      };
      ctx.enemy.applyAttack(attack); // TODO three different enemies
    }
  }
}
