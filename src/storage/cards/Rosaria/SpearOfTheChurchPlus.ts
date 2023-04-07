import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class SpearOfTheChurchPlus extends AttackCard {
  public get Name(): string {
    return "SpearOfTheChurchPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 3,
      element: new Cryo(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      ctx.attacker.addActionPoints(1);
    }
  }
}
