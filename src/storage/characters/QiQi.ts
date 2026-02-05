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
    const cryo = new Cryo();
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(cryo, ctx.player);
      ctx.addToSteps([
        { type: "enemy_get_element", enemyId: enemy.ID, element: cryo.Name },
      ]);
    }

    ctx.player.addHealth(2);
    ctx.addToSteps([{ type: "player_heal", playerId: ctx.player.ID, amount: 2 }]);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
      ctx.addToSteps([
        { type: "player_heal", playerId: ctx.selectedPlayer.ID, amount: 2 },
      ]);
    }
  }
}
