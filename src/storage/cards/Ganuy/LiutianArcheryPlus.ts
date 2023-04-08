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

    const attack: Attack = {
      damage: 2,
      isRange: true,
      player: ctx.player,
    };

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      attack.element = new Cryo();
      attack.damage *= 3;
    }

    ctx.enemies[0].applyAttack(attack);
  }
}
