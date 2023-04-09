import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
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
      if (enemy.isContainsElement(new Electro())) {
        const attack: Attack = {
          damage: 5,
          isPiercing: true,
          player: ctx.player,
        };
        enemy.applyAttack(attack);
      }
    }
  }
}
