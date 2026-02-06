import { CharacterUseBurstContext } from "../../types/functionsContext";
import { SpearOfTheChurch } from "../cards/Rosaria/SpearOfTheChurch";
import { RavagingConfession } from "../cards/Rosaria/RavagingConfession";
import { Character } from "./Character";
import { Attack } from "../../types/general";
import { Cryo } from "../elements/Cryo";

export class Rosaria extends Character {
  public get Name() {
    return "Rosaria";
  }

  constructor() {
    const cards = [
      new SpearOfTheChurch(),
      new SpearOfTheChurch(),
      new SpearOfTheChurch(),
      new RavagingConfession(),
      new RavagingConfession(),
    ];
    super({ cards, burstCost: 8 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (ctx.selectedEnemy) {
      const attack: Attack = { damage: 3, player: ctx.player };
      ctx.selectedEnemy.applyAttack(attack);
    }

    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 3,
        element: new Cryo(),
        player: ctx.player,
      };
      enemy.applyAttack(attack);
    }
  }
}
