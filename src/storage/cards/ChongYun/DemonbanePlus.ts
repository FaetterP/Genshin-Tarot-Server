import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class DemonbanePlus extends AttackCard {
  public get Name(): string {
    return "DemonbanePlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Cryo().Name
      )
    ) {
      const attack: Attack = { damage: 4, player: ctx.attacker };
      ctx.enemy.applyAttack(attack);
    } else {
      for (const enemy of ctx.attacker.Enemies) {
        const attack: Attack = { damage: 2, player: ctx.attacker };
        enemy.applyAttack(attack);
      }
    }
  }
}
