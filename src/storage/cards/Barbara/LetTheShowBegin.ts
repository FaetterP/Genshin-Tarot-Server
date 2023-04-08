import { CardUseContext } from "../../../../types/functionsContext";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class LetTheShowBegin extends Card {
  public get Name(): string {
    return "LetTheShowBegin";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (!ctx.selectedPlayer) {
      throw new Error("no selected player");
    }

    ctx.enemies[0].applyElement(new Hydro(), ctx.player);

    let healCount = 1;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      healCount = 3;
    }

    ctx.selectedPlayer.addHealth(healCount);
  }
}
