import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class WeissBladework extends Card {
  public get Name(): string {
    return "WeissBladework";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 2;

    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);
    if (target.isContainsElement(new Geo())) {
      ctx.addToSteps([{
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      }]);
    }

    const attack: Attack = { damage, player: ctx.player };
    target.applyAttack(attack);
    if (target.isContainsElement(new Geo())) {
      ctx.player.addEnergy(2);
    }
  }
}
