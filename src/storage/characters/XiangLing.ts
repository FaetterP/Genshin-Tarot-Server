import { CharacterUseBurstContext } from "../../types/functionsContext";
import { DoughFu } from "../cards/XiangLing/DoughFu";
import { GuobaFire } from "../cards/XiangLing/GuobaFire";
import { PyronadoEffect } from "../effects/PyronadoEffect";
import { Character } from "./Character";

export class XiangLing extends Character {
  public get Name() {
    return "XiangLing";
  }

  constructor() {
    const cards = [
      new DoughFu(),
      new DoughFu(),
      new DoughFu(),
      new GuobaFire(),
      new GuobaFire(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    const card1 = ctx.player.drawCard();
    const card2 = ctx.player.drawCard();

    ctx.player.addEffect(new PyronadoEffect());

    ctx.addToSteps([
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [
          card1.getPrimitive(),
          card2.getPrimitive(),
        ],
      },
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: new PyronadoEffect().Name,
      },
    ]);
  }
}
