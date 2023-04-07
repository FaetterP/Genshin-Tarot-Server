import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class SpearOfTheChurchPlus extends Card {
  public get Name(): string {
    return "SpearOfTheChurchPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 3,
      element: new Cryo(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      ctx.player.addActionPoints(1);
    }
  }
}
