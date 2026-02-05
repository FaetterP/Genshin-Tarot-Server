import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { LiutianArchery as LiutianArcheryPlus } from "./LiutianArcheryPlus";

export class LiutianArchery extends Card {
  public get Name(): string {
    return "LiutianArchery";
  }

  constructor() {
    super(0);
  }

  get Upgrade() {
    return LiutianArcheryPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let element: string | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = "Cryo";
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
    if (element) attack.element = new Cryo();
    target.applyAttack(attack);
  }
}
