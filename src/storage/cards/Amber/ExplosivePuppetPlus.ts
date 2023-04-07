import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class ExplosivePuppetPlus extends Card {
  public get Name(): string {
    return "ExplosivePuppetPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.addStun();

    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      };

      enemy.applyAttack(attack);
    }
  }
}
