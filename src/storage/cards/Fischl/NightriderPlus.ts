import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class NightriderPlus extends Card {
  public get Name(): string {
    return "NightriderPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Electro(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
