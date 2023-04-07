import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class SpearOfTheChurch extends AttackCard {
  public get Name(): string {
    return "SpearOfTheChurch";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      const attack: Attack = {
        damage: 1,
        isPiercing: true,
        isRange: true,
        player: ctx.attacker,
      };
      // TODO attack any enemy
    }
  }
}
