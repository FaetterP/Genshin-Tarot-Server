import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class PassionOverloadPlus extends AttackCard {
  public get Name(): string {
    return "PassionOverloadPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 4,
      element: new Pyro(),
      player: ctx.attacker,
    };
    // TODO
  }
}
