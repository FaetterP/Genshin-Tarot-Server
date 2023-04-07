import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class FireworkFlareUpPlus extends Card {
  public get Name(): string {
    return "FireworkFlareUpPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = { damage: 2, isRange: true, element:new Pyro(), player: ctx.player };
    ctx.enemy.applyAttack(attack);
    // TODO attack 3 enemies
  }
}
