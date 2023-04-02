import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class KaboomPlus extends AttackCard {
  public get Name(): string {
    return "KaboomPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
      element: new Pyro(),
    };
    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(2)) {
      attack.damage = 4;
    }

    ctx.enemy.applyAttack(attack);
  }
}
