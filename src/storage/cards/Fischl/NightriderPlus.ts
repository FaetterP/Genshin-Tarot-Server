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

    const target = ctx.enemies[0];
    const effect = new NightriderPlusEffect(target);
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 2,
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
      damage: 2,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    });
    ctx.player.addEffect(effect);
  }
}
