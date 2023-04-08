import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { removeDuplicates } from "../../../utils/arrays";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class JumpyDumptyPlus extends Card {
  public get Name(): string {
    return "JumpyDumptyPlus";
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
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      };
      enemies[i].applyAttack(attack);
    }

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      for (let i = 0; i < 2; i++) {
        const attack: Attack = {
          damage: 2,
          element: new Pyro(),
          player: ctx.player,
        };
        enemies[i].applyAttack(attack);
      }
    }
  }
}
