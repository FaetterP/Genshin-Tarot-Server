import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class StrikeOfFortune extends AttackCard {
  public get Name(): string {
    return "StrikeOfFortune";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Pyro().Name
      )
    ) {
      ctx.attacker.addEnergy(2);
    }
  }
}
