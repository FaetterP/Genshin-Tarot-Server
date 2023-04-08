import { CardUseContext } from "../../../../types/functionsContext";
import { TrailOfTheQilinEffect } from "../../effects/TrailOfTheQilinEffect";
import { Card } from "../Card";

export class TrailOfTheQilin extends Card {
  public get Name(): string {
    return "TrailOfTheQilin";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    ctx.enemies[0].addStun();

    ctx.player.addEffect(new TrailOfTheQilinEffect());
  }
}
