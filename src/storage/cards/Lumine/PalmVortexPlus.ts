import { CardUseContext } from "../../../types/functionsContext";
import { Attack, EElement } from "../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Electro } from "../../elements/Electro";
import { Hydro } from "../../elements/Hydro";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class PalmVortexPlus extends Card {
  public get Name(): string {
    return "PalmVortexPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      if (
        enemy.isContainsElement(EElement.Hydro) ||
        enemy.isContainsElement(EElement.Pyro) ||
        enemy.isContainsElement(EElement.Cryo) ||
        enemy.isContainsElement(EElement.Electro)
      ) {
        ctx.addToSteps([{
          type: "enemy_take_damage",
          enemyId: enemy.ID,
          damage: 4,
          isPiercing: false,
        }]);
      }
    }

    for (const enemy of ctx.player.Enemies) {
      if (
        enemy.isContainsElement(EElement.Hydro) ||
        enemy.isContainsElement(EElement.Pyro) ||
        enemy.isContainsElement(EElement.Cryo) ||
        enemy.isContainsElement(EElement.Electro)
      ) {
        const attack: Attack = { damage: 4, player: ctx.player };
        enemy.applyAttack(attack);
      }
    }
  }
}
