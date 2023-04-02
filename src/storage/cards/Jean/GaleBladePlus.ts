import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class GaleBladePlus extends AttackCard {
  public get Name(): string {
    return "GaleBladePlus";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);
  }
}
