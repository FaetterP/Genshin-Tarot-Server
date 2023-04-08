import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class KaboomPlus extends Card {
  public get Name(): string {
    return "KaboomPlus";
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
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    };

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      attack.damage *= 2;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
