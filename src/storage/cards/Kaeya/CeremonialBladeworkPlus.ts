import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { getRandomInteger } from "../../../utils/math";
import { Card } from "../Card";

export class CeremonialBladeworkPlus extends Card {
  public get Name(): string {
    return "CeremonialBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = { damage: 2, player: ctx.player };
    attack.damage += getRandomInteger(1, 7);
    ctx.enemy.applyAttack(attack);
  }
}
