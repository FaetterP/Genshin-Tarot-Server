import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { NightriderEffect } from "../../effects/NightriderEffect";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { NightriderPlus } from "./NightriderPlus";

export class Nightrider extends Card {
  public get Name(): string {
    return "Nightrider";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return NightriderPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const effect = new NightriderEffect(target);
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: "Electro",
      },
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      element: new Electro(),
      player: ctx.player,
    });
    ctx.player.addEffect(effect);
  }
}
