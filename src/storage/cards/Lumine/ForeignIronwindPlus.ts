import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class ForeignIronwindPlus extends AttackCard {
  public get Name(): string {
    return "ForeignIronwindPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 3,
      element: new Anemo(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    ctx.attacker.addEnergy(2);
  }
}
