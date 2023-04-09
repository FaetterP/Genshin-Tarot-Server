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
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 2,
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.enemies[0].isContainsElement(new Anemo())) {
      ctx.player.addEnergy(2);
    }
  }
}
