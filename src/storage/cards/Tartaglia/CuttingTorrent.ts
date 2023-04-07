import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class CuttingTorrent extends Card {
  public get Name(): string {
    return "CuttingTorrent";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };

    if (ctx.isUseAlternative) {
      attack.element = new Hydro();
    }

    ctx.enemy.applyAttack(attack);
  }
}
