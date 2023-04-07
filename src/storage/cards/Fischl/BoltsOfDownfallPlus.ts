import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class BoltsOfDownfallPlus extends Card {
  public get Name(): string {
    return "BoltsOfDownfallPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
