import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class AncientSwordArtPlus extends AttackCard {
  public get Name(): string {
    return "AncientSwordArtPlus";
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
      const attack: Attack = { damage: 5, player: ctx.attacker };
      ctx.enemy.applyAttack(attack);
    } else {
      const attack: Attack = { damage: 2, player: ctx.attacker };
      ctx.enemy.applyAttack(attack);
      ctx.attacker.addEnergy(2);
    }
  }
}
