import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Electro } from "../../elements/Electro";
import { Hydro } from "../../elements/Hydro";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { PalmVortexPlus } from "./PalmVortexPlus";

export class PalmVortex extends Card {
  public get Name(): string {
    return "PalmVortex";
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return PalmVortexPlus;
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      if (
        enemy.isContainsElement(EElement.Hydro) ||
        enemy.isContainsElement(EElement.Pyro) ||
        enemy.isContainsElement(EElement.Cryo) ||
        enemy.isContainsElement(EElement.Electro)
      ) {
        ctx.addToSteps([
          {
            type: "enemy_take_damage",
            enemyId: enemy.ID,
            damage: 2,
            isPiercing: false,
          },
        ]);
      }
    }

    for (const enemy of ctx.player.Enemies) {
      if (
        enemy.isContainsElement(EElement.Hydro) ||
        enemy.isContainsElement(EElement.Pyro) ||
        enemy.isContainsElement(EElement.Cryo) ||
        enemy.isContainsElement(EElement.Electro)
      ) {
        const attack: Attack = { damage: 2, player: ctx.player };
        enemy.applyAttack(attack);
      }
    }
  }
}
