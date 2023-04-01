import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class AncientSwordArt extends AttackCard {
  public get Name(): string {
    return "AncientSwordArt";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = { damage: 2, player: ctx.attacker };
    ctx.enemy.applyAttack(attack);

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Cryo().Name
      )
    ) {
      ctx.attacker.addEnergy(2);
    }
  }
}
