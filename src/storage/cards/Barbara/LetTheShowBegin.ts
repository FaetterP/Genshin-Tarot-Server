import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
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
    ctx.enemy.applyElement(new Hydro(), ctx.player);

    let healCount = 1;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      healCount = 3;
    }

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(healCount);
    } else {
      ctx.player.addHealth(healCount);
    }
  }
}
