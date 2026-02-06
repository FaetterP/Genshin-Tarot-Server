import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../Card";

export class BoltsOfDownfallPlus extends Card {
  public get Name(): string {
    return "BoltsOfDownfallPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = target.hasEffect("Nightrider") ? 3 : 1;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: true,
      },
    ]);
    const attack: Attack = {
      damage,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    target.applyAttack(attack);
  }
}
