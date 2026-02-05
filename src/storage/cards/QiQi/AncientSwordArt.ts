import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class AncientSwordArt extends Card {
  public get Name(): string {
    return "AncientSwordArt";
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
        damage: 2,
        isPiercing: false,
      },
    ]);
    if (target.isContainsElement(new Cryo())) {
      ctx.addToSteps([{
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      }]);
    }
    target.applyAttack({ damage: 2, player: ctx.player });
    if (target.isContainsElement(new Cryo())) {
      ctx.player.addEnergy(2);
    }
  }
}
