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
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
    };

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      attack.element = new Cryo();
    }

    ctx.enemy.applyAttack(attack);
  }
}
