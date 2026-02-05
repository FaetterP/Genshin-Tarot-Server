import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class Kaboom extends Card {
  public get Name(): string {
    return "Kaboom";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: "Pyro",
      },
      {
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    });
    ctx.player.addEnergy(1);
  }
}
