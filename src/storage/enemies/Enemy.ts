import { Attack } from "../../utils/gameplay/Attack";
import { Element } from "../elements/Element";

type constructorSetup = {
  hp: number;
  damage: number;
  mora: number;
  shield: number;
};

export abstract class Enemy {
  private hp: number;
  private shield: number;
  private elements: Element[] = [];

  constructor({ hp, damage, mora, shield }: constructorSetup) {
    this.hp = hp;
    this.shield = shield;
  }

  applyAttack(attack: Attack) {
    if (this.shield <= 0 || attack.IsPiercing) {
      this.hp -= attack.Damage;
    }

    this.elements = [...this.elements, ...attack.Elements];
  }
}
