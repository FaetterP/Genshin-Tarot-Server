import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { UseableCard } from "../UseableCard";

export class GuobaFirePlus extends UseableCard {
  public get Name(): string {
    return "GuobaFirePlus";
  }

  constructor() {
    super(1);
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
