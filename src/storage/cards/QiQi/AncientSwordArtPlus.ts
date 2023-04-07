import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class AncientSwordArtPlus extends Card {
  public get Name(): string {
    return "AncientSwordArtPlus";
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
      const attack: Attack = { damage: 5, player: ctx.player };
      ctx.enemy.applyAttack(attack);
    } else {
      const attack: Attack = { damage: 2, player: ctx.player };
      ctx.enemy.applyAttack(attack);
      ctx.player.addEnergy(2);
    }
  }
}
