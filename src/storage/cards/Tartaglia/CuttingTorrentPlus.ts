import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class CuttingTorrentPlus extends AttackCard {
  public get Name(): string {
    return "CuttingTorrentPlus";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isRange: true,
      isPiercing: true,
      player: ctx.attacker,
    };

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Hydro().Name
      )
    ) {
      attack.damage = 3;
    }

    ctx.enemy.applyAttack(attack);
  }
}
