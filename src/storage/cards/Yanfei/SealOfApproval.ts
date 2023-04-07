import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SealOfApproval extends Card {
  public get Name(): string {
    return "SealOfApproval";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);
  }
}
