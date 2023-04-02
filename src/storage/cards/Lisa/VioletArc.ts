import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { UseableCard } from "../UseableCard";

export class VioletArc extends UseableCard {
  public get Name(): string {
    return "VioletArc";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      if (
        enemy.Elements.map((element) => element.Name).includes(
          new Electro().Name
        )
      ) {
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