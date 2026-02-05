import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Electro } from "../../elements/Electro";
import { Hydro } from "../../elements/Hydro";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class PalmVortex extends Card {
  public get Name(): string {
    return "PalmVortex";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      if (
        enemy.isContainsElement(new Hydro()) ||
        enemy.isContainsElement(new Pyro()) ||
        enemy.isContainsElement(new Cryo()) ||
        enemy.isContainsElement(new Electro())
      ) {
        ctx.addToSteps([{
          type: "enemy_take_damage",
          enemyId: enemy.ID,
          damage: 2,
          isPiercing: false,
        }]);
      }
    }

    for (const enemy of ctx.player.Enemies) {
      if (
        enemy.isContainsElement(new Hydro()) ||
        enemy.isContainsElement(new Pyro()) ||
        enemy.isContainsElement(new Cryo()) ||
        enemy.isContainsElement(new Electro())
      ) {
        const attack: Attack = { damage: 2, player: ctx.player };
        enemy.applyAttack(attack);
      }
    }
  }
}
