import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class MirrorReflectionsPlus extends Card {
  public get Name(): string {
    return "MirrorReflectionsPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.addStun();

    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Hydro(),
        player: ctx.player,
      };
      enemy.applyAttack(attack);
    }
  }
}
