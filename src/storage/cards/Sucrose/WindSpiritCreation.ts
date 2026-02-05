import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { WindSpiritCreationPlus } from "./WindSpiritCreationPlus";

export class WindSpiritCreation extends Card {
  public get Name(): string {
    return "WindSpiritCreation";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return WindSpiritCreationPlus;
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
        element: "Anemo",
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
      element: new Anemo(),
      player: ctx.player,
    });
    ctx.player.addEnergy(1);
  }
}
