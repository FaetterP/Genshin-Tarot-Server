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
    const attack: Attack = {
      damage: 3,
      player: ctx.player,
      element: new Geo(),
    };
    ctx.enemy.applyAttack(attack);

    ctx.player.addEnergy(2);
  }
}
