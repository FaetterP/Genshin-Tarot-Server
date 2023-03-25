import { Player } from "../../game/Player";
import { Event } from "../../utils/Event";
import { Attack } from "../../game/Attack";
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

  public get Health() {
    return this.hp;
  }
  public get Shield() {
    return this.shield;
  }

  constructor({ hp, damage, mora, shield }: constructorSetup) {
    this.hp = hp;
    this.shield = shield;
  }

  applyAttack(attack: Attack) {
    if (this.shield <= 0 || attack.IsPiercing) {
      this.hp -= attack.Damage;
    }

    this.applyElement(attack.Element, attack.Player);

    if (this.hp <= 0) {
      this.onDeath.Invoke(null);
    }
  }

  applyElement(element: Element | undefined, player: Player) {
    if (!element) {
      return;
    }

    this.elements = [...this.elements, element];

    if (this.elements.length >= 2) {
      this.elements.forEach((el) => {
        const ctx = { enemy: this, player };
        el.reaction(ctx);
      });

      this.elements = [];
    }
  }

  private onDeath = new Event();
}
