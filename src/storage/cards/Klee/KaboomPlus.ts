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
      player: ctx.player,
      element: new Pyro(),
    };
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      attack.damage = 4;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
