import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class TrailOfTheQilin extends Card {
  public get Name(): string {
    return "TrailOfTheQilin";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.addStun();

    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Cryo(),
        player: ctx.player,
      };
      enemy.applyAttack(attack);
    }
  }
}
