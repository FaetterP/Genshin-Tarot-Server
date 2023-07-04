import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { Dash } from "../misc/Dash";

export class LemniscaticWindPlus extends Card {
  public get Name(): string {
    return "LemniscaticWindPlus";
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
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    };

    if (ctx.player.LastCard instanceof Dash) {
      attack.damage = 5;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
