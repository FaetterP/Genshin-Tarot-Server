import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class ForeignRockbladePlus extends Card {
  public get Name(): string {
    return "ForeignRockbladePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 3,
      element: new Geo(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    ctx.player.addEnergy(2);
  }
}
