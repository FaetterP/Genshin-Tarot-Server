import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { AttackCard } from "../AttackCard";

export class BoltsOfDownfall extends AttackCard {
  public get Name(): string {
    return "BoltsOfDownfall";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
    };

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      attack.element = new Electro();
    }

    ctx.enemy.applyAttack(attack);
  }
}
