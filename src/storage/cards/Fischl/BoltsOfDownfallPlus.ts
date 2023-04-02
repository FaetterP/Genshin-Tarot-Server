import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { AttackCard } from "../AttackCard";

export class BoltsOfDownfallPlus extends AttackCard {
  public get Name(): string {
    return "BoltsOfDownfallPlus";
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
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
