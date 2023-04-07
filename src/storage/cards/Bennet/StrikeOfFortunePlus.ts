import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class StrikeOfFortunePlus extends Card {
  public get Name(): string {
    return "StrikeOfFortunePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 3,
      player: ctx.player,
    };

    if (ctx.player.Health <= 7) {
      attack.damage += 1;
      ctx.player.addEnergy(3);
    }

    ctx.enemy.applyAttack(attack);
  }
}
