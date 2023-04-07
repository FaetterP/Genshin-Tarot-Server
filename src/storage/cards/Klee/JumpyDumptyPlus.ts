import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class JumpyDumptyPlus extends Card {
  public get Name(): string {
    return "JumpyDumptyPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 2,
      element: new Pyro(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);
    // TODO attack two enemies

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      // attack extra two enemies
    }
  }
}
