import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class TrailOfTheQilin extends AttackCard {
  public get Name(): string {
    return "TrailOfTheQilin";
  }

  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.addStun();

    for (const enemy of ctx.attacker.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Cryo(),
        player: ctx.attacker,
      };
      enemy.applyAttack(attack);
    }
  }
}
