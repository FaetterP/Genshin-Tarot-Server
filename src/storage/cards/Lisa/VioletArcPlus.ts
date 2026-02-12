import { CardUseContext } from "../../../types/functionsContext";
import { Attack, EElement } from "../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class VioletArc extends Card {
  public get Name(): string {
    return "VioletArcPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      if (enemy.isContainsElement(EElement.Electro)) {
        ctx.addToSteps([{
          type: "enemy_take_damage",
          enemyId: enemy.ID,
          damage: 5,
          isPiercing: true,
          element: EElement.Electro,
        }]);
      }
    }

    for (const enemy of ctx.player.Enemies) {
      if (enemy.isContainsElement(EElement.Electro)) {
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
