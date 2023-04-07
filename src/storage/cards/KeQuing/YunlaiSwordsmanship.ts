import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class YunlaiSwordsmanship extends Card {
  public get Name(): string {
    return "YunlaiSwordsmanship";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = { damage: 3, player: ctx.player };
    ctx.enemy.applyAttack(attack);
  }
}
