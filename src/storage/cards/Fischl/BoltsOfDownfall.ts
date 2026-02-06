import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { BoltsOfDownfallPlus } from "./BoltsOfDownfallPlus";

export class BoltsOfDownfall extends Card {
  public get Name(): string {
    return "BoltsOfDownfall";
  }

  constructor() {
    super(0);
  }

  get Upgrade() {
    return BoltsOfDownfallPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let element: string | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = "Electro";
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
    if (element) attack.element = new Electro();
    target.applyAttack(attack);
  }
}
