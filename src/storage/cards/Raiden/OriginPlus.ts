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
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    ctx.player.addEnergy(2);

    const attack: Attack = { damage: 2, player: ctx.player };

    if (ctx.enemies[0].isContainsElement(new Electro())) {
      attack.damage = 5;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
