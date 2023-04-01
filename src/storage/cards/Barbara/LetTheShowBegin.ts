import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class LetTheShowBegin extends AttackCard {
  public get Name(): string {
    return "LetTheShowBegin";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 0,
      element: new Hydro(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    let healCount = 1;
    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(2)) {
      healCount = 3;
    }

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(healCount);
    } else {
      ctx.attacker.addHealth(healCount);
    }
  }
}
