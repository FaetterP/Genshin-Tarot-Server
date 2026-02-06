import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class OriginPlus extends Card {
  public get Name(): string {
    return "OriginPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = target.isContainsElement(new Electro()) ? 5 : 2;
    ctx.addToSteps([
      {
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: "Electro",
      },
    ]);
    ctx.player.addEnergy(2);
    target.applyAttack({
      damage,
      element: new Electro(),
      player: ctx.player,
    });
  }
}
