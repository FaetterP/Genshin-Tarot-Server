import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class CuttingTorrent extends Card {
  public get Name(): string {
    return "CuttingTorrent";
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
      element = "Hydro";
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
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };
    if (element) attack.element = new Hydro();
    target.applyAttack(attack);
  }
}
