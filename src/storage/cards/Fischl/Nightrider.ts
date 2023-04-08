import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { NightriderEffect } from "../../effects/NightriderEffect";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class Nightrider extends Card {
  public get Name(): string {
    return "Nightrider";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      element: new Electro(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    ctx.player.addEffect(new NightriderEffect(ctx.enemies[0]));
  }
}
