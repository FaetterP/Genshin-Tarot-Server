import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class StrikeOfFortunePlus extends Card {
  public get Name(): string {
    return "StrikeOfFortunePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = ctx.player.Health <= 7 ? 4 : 3;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);
    if (ctx.player.Health <= 7) {
      ctx.addToSteps([{
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 3,
      }]);
    }

    const attack: Attack = { damage, player: ctx.player };
    if (ctx.player.Health <= 7) {
      ctx.player.addEnergy(3);
    }
    target.applyAttack(attack);
  }
}
