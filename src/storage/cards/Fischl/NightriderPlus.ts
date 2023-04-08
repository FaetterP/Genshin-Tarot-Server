import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { NightriderPlusEffect } from "../../effects/NightriderPlusEffect";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class NightriderPlus extends Card {
  public get Name(): string {
    return "NightriderPlus";
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
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    ctx.player.addEffect(new NightriderPlusEffect(ctx.enemies[0]));
  }
}
