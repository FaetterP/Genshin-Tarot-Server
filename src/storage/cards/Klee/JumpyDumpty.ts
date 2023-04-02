import {
  CardAttackContext,
  CardUseContext,
} from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class JumpyDumpty extends AttackCard {
  public get Name(): string {
    return "JumpyDumpty";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      element: new Pyro(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);
    // TODO attack two enemies
    // TODO place card to top of deck
  }
}
