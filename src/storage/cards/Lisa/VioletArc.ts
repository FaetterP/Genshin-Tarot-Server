import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { VioletArc as VioletArcPlus } from "./VioletArcPlus";

export class VioletArc extends Card {
  public get Name(): string {
    return "VioletArc";
  }

  constructor() {
    super(2);
  }

  get Upgrade() {
    return VioletArcPlus;
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      if (enemy.isContainsElement(new Electro())) {
        ctx.addToSteps([{
          type: "enemy_take_damage",
          enemyId: enemy.ID,
          damage: 5,
          isPiercing: true,
          element: "Electro",
        }]);
      }
    }

    for (const enemy of ctx.player.Enemies) {
      if (enemy.isContainsElement(new Electro())) {
        enemy.applyAttack({
          damage: 5,
          isPiercing: true,
          element: new Electro(),
          player: ctx.player,
        });
      }
    }
  }
}
