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
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = { damage: 3, player: ctx.player };
    ctx.enemies[0].applyAttack(attack);
  }
}