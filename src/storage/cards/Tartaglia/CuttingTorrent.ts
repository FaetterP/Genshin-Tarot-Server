import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class CuttingTorrent extends AttackCard {
  public get Name(): string {
    return "CuttingTorrent";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isRange: true,
      isPiercing: true,
      player: ctx.attacker,
    };

    if (ctx.isUseAlternative) {
      attack.element = new Hydro();
    }

    ctx.enemy.applyAttack(attack);
  }
}
