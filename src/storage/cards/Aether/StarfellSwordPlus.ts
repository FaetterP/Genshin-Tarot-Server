import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class StarfellSwordPlus extends Card {
  public get Name(): string {
    return "StarfellSwordPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        isPiercing: true,
        element: new Geo(),
        player: ctx.player,
      };

      enemy.applyAttack(attack);
    }
  }
}
