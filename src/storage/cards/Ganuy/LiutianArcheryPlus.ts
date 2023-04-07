import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class LiutianArchery extends AttackCard {
  public get Name(): string {
    return "LiutianArchery";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      isRange: true,
      player: ctx.attacker,
    };

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(2)) {
      attack.element = new Cryo();
      attack.damage = 6;
    }

    ctx.enemy.applyAttack(attack);
  }
}
