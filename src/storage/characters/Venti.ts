import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Attack } from "../../game/Attack";
import { Card } from "../cards/Card";
import { Cryo } from "../elements/Cryo";
import { Electro } from "../elements/Electro";
import { Hydro } from "../elements/Hydro";
import { Pyro } from "../elements/Pyro";
import { Character } from "./Character";

export class Venti extends Character {
  public get Name() {
    return "Venti";
  }

  constructor() {
    const cards: Card[] = [
      // TODO
    ];
    super({ cards, burstCost: 10 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    for (const player of ctx.allPlayers) {
      for (const enemy of player.Enemies) {
        if (
          enemy.Elements[0] instanceof Hydro ||
          enemy.Elements[0] instanceof Pyro ||
          enemy.Elements[0] instanceof Cryo ||
          enemy.Elements[0] instanceof Electro
        ) {
          const attackSetup = {
            damage: 4,
            isPiercing: true,
            player: ctx.player,
          };
          const attack = new Attack(attackSetup);

          enemy.applyAttack(attack);
        }
      }
    }
  }
}
