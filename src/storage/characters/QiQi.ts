import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { AncientSwordArt } from "../cards/QiQi/AncientSwordArt";
import { HeraldOfFrost } from "../cards/QiQi/HeraldOfFrost";
import { Cryo } from "../elements/Cryo";
import { Character } from "./Character";

export class QiQi extends Character {
  public get Name() {
    return "QiQi";
  }

  constructor() {
    const cards = [
      new AncientSwordArt(),
      new AncientSwordArt(),
      new AncientSwordArt(),
      new HeraldOfFrost(),
      new HeraldOfFrost(),
    ];
    super({ cards, burstCost: 5 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }

    ctx.player.addHealth(2);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
    }
  }
}
