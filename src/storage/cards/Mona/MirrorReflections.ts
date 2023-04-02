import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class MirrorReflections extends AttackCard {
  public get Name(): string {
    return "MirrorReflections";
  }

  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.addStun();

    for (const enemy of ctx.attacker.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Hydro(),
        player: ctx.attacker,
      };
      enemy.applyAttack(attack);
    }
  }
}
