import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class CuttingTorrentPlus extends Card {
  public get Name(): string {
    return "CuttingTorrentPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };

    if (ctx.enemies[0].isContainsElement(new Hydro())) {
      attack.damage = 3;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
