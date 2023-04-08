import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { MirrorReflectionsEffect } from "../../effects/MirrorReflectionsEffect";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class MirrorReflections extends Card {
  public get Name(): string {
    return "MirrorReflections";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    ctx.enemies[0].addStun();

    ctx.player.addEffect(new MirrorReflectionsEffect());
  }
}
