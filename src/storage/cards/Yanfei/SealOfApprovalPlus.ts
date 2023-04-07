import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SealOfApprovalPlus extends Card {
  public get Name(): string {
    return "SealOfApprovalPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
