import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Attack } from "../../types/general";
import { EElement } from "../../types/enums";
import { YunlaiSwordsmanship } from "../cards/KeQuing/YunlaiSwordsmanship";
import { StellarRestoration } from "../cards/KeQuing/StellarRestoration";
import { Electro } from "../elements/Electro";
import { ECharacter } from "../../types/enums";
import { Character } from "./Character";

export class KeQing extends Character {
  public get Name() {
    return ECharacter.KeQing;
  }

  constructor() {
    const cards = [
      new YunlaiSwordsmanship(),
      new YunlaiSwordsmanship(),
      new YunlaiSwordsmanship(),
      new StellarRestoration(),
      new StellarRestoration(),
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
      if (enemy.isContainsElement(EElement.Electro)) {
        const attack: Attack = {
          damage: 5,
          isPiercing: true,
          isRange: true,
          player: ctx.player,
        };
        enemy.applyAttack(attack);
        // TODO remove Electro
      }
    }
  }
}
