import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class LetTheShowBeginPlus extends AttackCard {
  public get Name(): string {
    return "LetTheShowBeginPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    for (const enemy of ctx.attacker.Enemies) {
      const attack: Attack = {
        damage: 0,
        element: new Hydro(),
        player: ctx.attacker,
      };
      ctx.enemy.applyAttack(attack);
    }
    // TODO all attacks heal 1
  }
}
