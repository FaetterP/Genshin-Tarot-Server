import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class FavoniusBladeworkPlus extends Card {
  public get Name(): string {
    return "FavoniusBladeworkPlus";
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

    ctx.player.addEnergy(2);
    ctx.player.addHealth(2);
  }
}
