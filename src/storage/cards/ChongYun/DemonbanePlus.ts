import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class DemonbanePlus extends Card {
  public get Name(): string {
    return "DemonbanePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Cryo().Name
      )
    ) {
      const attack: Attack = { damage: 4, player: ctx.player };
      ctx.enemy.applyAttack(attack);
    } else {
      for (const enemy of ctx.player.Enemies) {
        const attack: Attack = { damage: 2, player: ctx.player };
        enemy.applyAttack(attack);
      }
    }
  }
}
