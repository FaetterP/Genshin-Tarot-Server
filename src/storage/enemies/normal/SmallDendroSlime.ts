import { Attack } from "../../../../types/general";
import { Player } from "../../../game/Player";
import { Element } from "../../elements/Element";
import { Pyro } from "../../elements/Pyro";
import { Enemy } from "../Enemy";

export class SmallDendroSlime extends Enemy {
  public get Name() {
    return "SmallDendroSlime";
  }

  constructor() {
    const setup = { hp: 7, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override applyElement(element: Element, player: Player): void {
    if (element instanceof Pyro) {
      const attack: Attack = { damage: 2, player };
      this.applyAttack(attack);
    }

    super.applyElement(element, player);
  }
}
