import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { MirrorReflectionsEffect } from "../../effects/MirrorReflectionsEffect";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { MirrorReflectionsPlus } from "./MirrorReflectionsPlus";

export class MirrorReflections extends Card {
  public get Name(): ECard {
    return ECard.MirrorReflections;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return MirrorReflectionsPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const effect = new MirrorReflectionsEffect();
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.enemies[0].addStun();
    ctx.player.addEffect(effect);
  }
}
