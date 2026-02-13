import { Attack } from "../../../types/general";
import { Player } from "../../../game/Player";
import { BaseElement } from "../../elements/BaseElement";
import { Pyro } from "../../elements/Pyro";
import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class GiantDendroSlime extends Enemy {
  public get Name() {
    return EEnemy.GiantDendroSlime;
  }

  constructor() {
    const setup = { hp: 7, mora: 3, damage: 2, shield: 0 };
    super(setup);
  }

  override applyElement(element: BaseElement, player: Player): void {
    if (element instanceof Pyro) {
      const attack: Attack = { damage: 2, player };
      this.applyAttack(attack);
    }

    super.applyElement(element, player);
  }
}
