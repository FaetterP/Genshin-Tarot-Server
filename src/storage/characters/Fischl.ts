import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Attack } from "../../types/general";
import { BoltsOfDownfall } from "../cards/Fischl/BoltsOfDownfall";
import { Nightrider } from "../cards/Fischl/Nightrider";
import { Electro } from "../elements/Electro";
import { Character } from "./Character";

export class Fischl extends Character {
  public get Name() {
    return "Fischl";
  }

  constructor() {
    const cards = [
      new BoltsOfDownfall(),
      new BoltsOfDownfall(),
      new BoltsOfDownfall(),
      new Nightrider(),
      new Nightrider(),
    ];
    super({ cards, burstCost: 5 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedPlayer) {
      throw new Error("no player");
    }

    for (const enemy of ctx.selectedPlayer.Enemies) {
      const attack: Attack = {
        damage: 2,
        isPiercing: true,
        isRange: true,
        element: new Electro(),
        player: ctx.player,
      };
      enemy.applyAttack(attack);
    }
  }
}
