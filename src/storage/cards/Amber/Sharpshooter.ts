import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";

export class Sharpshooter extends Card {
  public get Name(): string {
    return "Sharpshooter";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      attack.element = new Pyro();
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
