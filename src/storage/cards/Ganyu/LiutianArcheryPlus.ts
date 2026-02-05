import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class LiutianArchery extends Card {
  public get Name(): string {
    return "LiutianArchery";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let damage = 2;
    let element: string | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      element = "Cryo";
      damage *= 3;
    }
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element,
      },
    ]);
    const attack: Attack = {
      damage,
      isRange: true,
      player: ctx.player,
    };
    if (element) attack.element = new Cryo();
    target.applyAttack(attack);
  }
}
