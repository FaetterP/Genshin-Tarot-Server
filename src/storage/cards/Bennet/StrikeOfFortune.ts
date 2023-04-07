import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class StrikeOfFortune extends Card {
  public get Name(): string {
    return "StrikeOfFortune";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 2,
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Pyro().Name
      )
    ) {
      ctx.player.addEnergy(2);
    }
  }
}
