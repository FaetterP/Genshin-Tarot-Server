import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { NightriderEffect } from "../../effects/NightriderEffect";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class BoltsOfDownfallPlus extends Card {
  public get Name(): string {
    return "BoltsOfDownfallPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };

    if (ctx.player.isContainsEffect(new NightriderEffect(ctx.enemies[0]))) {
      attack.damage = 3;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
