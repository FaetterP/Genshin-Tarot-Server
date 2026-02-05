import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class DivineArchery extends Card {
  public get Name(): string {
    return "DivineArchery";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let element: string | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = "Anemo";
    }
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element,
      },
    ]);
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    if (element) attack.element = new Anemo();
    target.applyAttack(attack);
  }
}
