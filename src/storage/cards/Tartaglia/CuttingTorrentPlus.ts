import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
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

    const target = ctx.enemies[0];
    const hasHydro = target.isContainsElement(new Hydro());
    const damage = hasHydro ? 3 : 1;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: true,
        element: hasHydro ? "Hydro" : undefined,
      },
    ]);
    const attack: Attack = {
      damage,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };
    if (hasHydro) attack.element = new Hydro();
    target.applyAttack(attack);
  }
}
