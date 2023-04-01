import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class WindSpiritCreationPlus extends AttackCard {
  public get Name(): string {
    return "WindSpiritCreationPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Anemo(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    // TODO attack two enemies
  }
}
