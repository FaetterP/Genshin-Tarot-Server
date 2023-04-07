import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SpearOfTheChurch extends Card {
  public get Name(): string {
    return "SpearOfTheChurch";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      const attack: Attack = {
        damage: 1,
        isPiercing: true,
        isRange: true,
        player: ctx.player,
      };
      // TODO attack any enemy
    }
  }
}
