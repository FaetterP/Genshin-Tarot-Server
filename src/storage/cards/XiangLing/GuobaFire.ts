import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class GuobaFire extends Card {
  public get Name(): string {
    return "GuobaFire";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      };
      enemy.applyAttack(attack);
    }

    // TODO
  }
}
