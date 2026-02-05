import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class ForeignIronwindPlus extends Card {
  public get Name(): string {
    return "ForeignIronwindPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 3;

    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: "Anemo",
      },
      { type: "player_change_energy", playerId: ctx.player.ID, delta: 2 },
    ]);

    const attack: Attack = {
      damage,
      element: new Anemo(),
      player: ctx.player,
    };
    target.applyAttack(attack);
    ctx.player.addEnergy(2);
  }
}
