import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class YunlaiSwordsmanshipPlus extends Card {
  public get Name(): string {
    return "YunlaiSwordsmanshipPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 3,
      element: new Electro(),
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    ctx.player.addEnergy(2);
  }
}
