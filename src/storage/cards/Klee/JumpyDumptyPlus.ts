import {
  CardAttackContext,
  CardUseContext,
} from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class JumpyDumptyPlus extends AttackCard {
  public get Name(): string {
    return "JumpyDumptyPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      element: new Pyro(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);
    // TODO attack two enemies

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(2)) {
      // attack extra two enemies
    }
  }
}
