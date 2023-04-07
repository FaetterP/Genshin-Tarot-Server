import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
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
    ctx.player.addEnergy(2);

    const attack: Attack = { damage: 2, player: ctx.player };

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Electro().Name
      )
    ) {
      attack.damage = 5;
    }

    ctx.enemy.applyAttack(attack);
  }
}
