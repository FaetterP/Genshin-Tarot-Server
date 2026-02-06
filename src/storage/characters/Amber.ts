import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Sharpshooter } from "../cards/Amber/Sharpshooter";
import { ExplosivePuppet } from "../cards/Amber/ExplosivePuppet";
import { Character } from "./Character";
import { Attack } from "../../types/general";
import { Pyro } from "../elements/Pyro";

export class Amber extends Character {
  public get Name() {
    return "Amber";
  }

  constructor() {
    const cards = [
      new Sharpshooter(),
      new Sharpshooter(),
      new Sharpshooter(),
      new ExplosivePuppet(),
      new ExplosivePuppet(),
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
        element: new Pyro(),
        player: ctx.player,
      };
      enemy.applyAttack(attack);
    }
  }
}
