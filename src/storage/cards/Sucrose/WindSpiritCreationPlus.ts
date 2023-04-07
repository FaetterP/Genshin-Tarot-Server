import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class WindSpiritCreationPlus extends Card {
  public get Name(): string {
    return "WindSpiritCreationPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Anemo(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    // TODO attack two enemies
  }
}
