import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Attack } from "../../types/general";
import { CuttingTorrent } from "../cards/Tartaglia/CuttingTorrent";
import { RagingTide } from "../cards/Tartaglia/RagingTide";
import { Hydro } from "../elements/Hydro";
import { Character } from "./Character";

export class Tartaglia extends Character {
  public get Name() {
    return "Tartaglia";
  }

  constructor() {
    const cards = [
      new CuttingTorrent(),
      new CuttingTorrent(),
      new CuttingTorrent(),
      new RagingTide(),
      new RagingTide(),
    ];
    super({ cards, burstCost: 8 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedEnemies?.length) {
      throw new Error("no enemies");
    }

    if (ctx.selectedEnemies.length > 3) {
      throw new Error("more 3 enemies");
    }

    for (const enemy of ctx.selectedEnemies) {
      if (enemy.isContainsElement(new Hydro())) {
        const attack: Attack = {
          damage: 5,
          isPiercing: true,
          isRange: true,
          player: ctx.player,
        };
        enemy.applyAttack(attack);
        // TODO remove Hydro
      }
    }
  }
}
