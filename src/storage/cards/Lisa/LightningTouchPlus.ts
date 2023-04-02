import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { AttackCard } from "../AttackCard";

export class LightningTouchPlus extends AttackCard {
  public get Name(): string {
    return "LightningTouchPlus";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    ctx.attacker.drawCard();
  }
}
