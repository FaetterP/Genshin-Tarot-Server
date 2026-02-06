import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class YunlaiSwordsmanshipPlus extends Card {
  public get Name(): string {
    return "YunlaiSwordsmanshipPlus";
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
        damage: 3,
        isPiercing: false,
        element: "Electro",
      },
      {
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    target.applyAttack({
      damage: 3,
      element: new Electro(),
      player: ctx.player,
    });
    ctx.player.addEnergy(2);
  }
}
