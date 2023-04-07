import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class FavoniusBladework extends Card {
  public get Name(): string {
    return "FavoniusBladework";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Anemo().Name
      )
    ) {
      ctx.player.addEnergy(2);
    }

    const attack: Attack = {
      damage: 2,
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);
  }
}
