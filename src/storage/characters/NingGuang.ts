import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../cards/Card";
import { Geo } from "../elements/Geo";
import { Character } from "./Character";
import { SparklingScatter } from "../cards/NingGuang/SparklingScatter";
import { JadeScreen } from "../cards/NingGuang/JadeScreen";

export class NingGuang extends Character {
  public get Name() {
    return "NingGuang";
  }

  constructor() {
    const cards: Card[] = [
      new SparklingScatter(),
      new SparklingScatter(),
      new SparklingScatter(),
      new JadeScreen(),
      new JadeScreen(),
    ];
    super({ cards, burstCost: 7 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedEnemy) {
      throw new Error("enemy not selected");
    }

    const attack: Attack = {
      damage: 3,
      isRange: true,
      player: ctx.player,
    };

    if (ctx.selectedEnemy.Elements[0] instanceof Geo) {
      attack.damage = 9;
    }

    ctx.selectedEnemy.applyAttack(attack);
  }
}
