import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { EdelBladeworkPlus } from "./EdelBladeworkPlus";

export class EdelBladework extends Card {
  public get Name(): string {
    return "EdelBladework";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return EdelBladeworkPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    if (target.Shield > 0) {
      ctx.addToSteps([
        { type: "enemy_change_shield", enemyId: target.ID, delta: -1 },
      ]);
      target.addShields(-1);
    } else {
      ctx.addToSteps([
        {
          type: "enemy_take_damage",
          enemyId: target.ID,
          damage: 2,
          isPiercing: false,
        },
      ]);
      target.applyAttack({ damage: 2, player: ctx.player });
    }

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      ctx.addToSteps([
        { type: "enemy_get_element", enemyId: target.ID, element: "Cryo" },
      ]);
      target.applyElement(new Cryo(), ctx.player);
    }
  }
}
