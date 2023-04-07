import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class LightningTouch extends Card {
  public get Name(): string {
    return "LightningTouch";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    ctx.player.drawCard();
  }
}
