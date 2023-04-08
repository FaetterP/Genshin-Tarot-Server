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
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = [...ctx.enemies, ...ctx.enemies, ...ctx.enemies];
    enemies.length = 3;

    for (let i = 0; i < 3; i++) {
      const attack: Attack = {
        damage: 2,
        isRange: true,
        element: new Pyro(),
        player: ctx.player,
      };
      ctx.enemies[i].applyAttack(attack);
    }
  }
}
