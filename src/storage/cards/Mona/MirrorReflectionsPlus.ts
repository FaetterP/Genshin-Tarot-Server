import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { MirrorReflectionsEffect } from "../../effects/MirrorReflectionsEffect";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class MirrorReflectionsPlus extends Card {
  public get Name(): string {
    return "MirrorReflectionsPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    ctx.enemies[0].addStun();

    ctx.player.addEffect(new MirrorReflectionsEffect());
  }
}
