import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class WindSpiritCreation extends AttackCard {
  public get Name(): string {
    return "WindSpiritCreation";
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

    ctx.attacker.addEnergy(1);
  }
}
