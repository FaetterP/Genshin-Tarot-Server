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
    const attack: Attack = {
      damage: 1,
      player: ctx.player,
      isRange: true,
      isPiercing: true,
    };

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      attack.element = new Pyro();
    }

    ctx.enemy.applyAttack(attack);
  }
}
