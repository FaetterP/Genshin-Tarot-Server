import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { removeDuplicates } from "../../../utils/arrays";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class JumpyDumpty extends Card {
  public get Name(): string {
    return "JumpyDumpty";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = removeDuplicates(ctx.enemies);
    if (enemies.length <= 2) {
      throw new Error("need 2 different enemies");
    }

    for (let i = 0; i < 2; i++) {
      const attack: Attack = {
        damage: 1,
        element: new Pyro(),
        player: ctx.player,
      };
      enemies[i].applyAttack(attack);
    }

    if (ctx.isUseAlternative) {
      // TODO place card to top of deck
    }
  }
}
