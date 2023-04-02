import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class MirrorReflectionsPlus extends AttackCard {
  public get Name(): string {
    return "MirrorReflectionsPlus";
  }

  constructor() {
    super(1);
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
