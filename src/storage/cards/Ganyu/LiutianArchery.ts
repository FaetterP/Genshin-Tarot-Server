import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class LiutianArchery extends Card {
  public get Name(): string {
    return "LiutianArchery";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      attack.element = new Cryo();
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
