import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Attack } from "../../types/general";
import { getRandomInteger } from "../../utils/math";
import { LiutianArchery } from "../cards/Ganyu/LiutianArchery";
import { TrailOfTheQilin } from "../cards/Ganyu/TrailOfTheQilin";
import { Cryo } from "../elements/Cryo";
import { Character } from "./Character";

export class Ganyu extends Character {
  public get Name() {
    return "Ganyu";
  }

  constructor() {
    const cards = [
      new LiutianArchery(),
      new LiutianArchery(),
      new LiutianArchery(),
      new TrailOfTheQilin(),
      new TrailOfTheQilin(),
    ];
    super({ cards, burstCost: 7 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedEnemies?.length) {
      throw new Error("no enemies");
    }

    if (ctx.selectedEnemies.length > 3) {
      throw new Error("more 3 enemies");
    }

    for (const enemy of ctx.selectedEnemies) {
      const attack: Attack = {
        damage: getRandomInteger(1, 7),
        isRange: true,
        player: ctx.player,
      };

      if (enemy.isContainsElement(new Cryo())) {
        attack.isPiercing = true;
      }

      enemy.applyAttack(attack);
    }
  }
}
