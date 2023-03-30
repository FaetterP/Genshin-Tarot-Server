import { Player } from "../../game/Player";
import { Event } from "../../utils/Event";
import { Attack } from "../../game/Attack";
import { Element } from "../elements/Element";
import { EnemyDeathContext } from "../../../types/eventsContext";
import { v4 } from "uuid";

type constructorSetup = {
  hp: number;
  damage: number;
  mora: number;
  shield: number;
};

export abstract class Enemy {
  public readonly ID: string;
  private hp: number;
  private shield: number;
  protected elements: Element[] = [];

  private e_onDeath = new Event<EnemyDeathContext>();

  public get Health() {
    return this.hp;
  }
  public get Shield() {
    return this.shield;
  }
  public get Elements(): ReadonlyArray<Element> {
    return this.elements;
  }
  public get OnDeath() {
    return {
      addListener: this.e_onDeath.AddListener.bind(this.e_onDeath),
      removeListener: this.e_onDeath.RemoveListener.bind(this.e_onDeath),
    };
  }

  constructor({ hp, damage, mora, shield }: constructorSetup) {
    this.ID = `enemy-${v4()}`;
    this.hp = hp;
    this.shield = shield;
  }

  applyAttack(attack: Attack) {
    if (this.shield <= 0 || attack.IsPiercing) {
      this.hp -= attack.Damage;
    }

    this.applyElement(attack.Element, attack.Player);

    if (this.hp <= 0) {
      this.e_onDeath.Invoke({ enemy: this });
    }
  }

  applyElement(element: Element | undefined, player: Player) {
    if (!element) {
      return;
    }

    this.elements = [...this.elements, element];

    if (this.elements.length >= 2) {
      this.addShields(-1);

      this.elements.forEach((el) => {
        const ctx = { enemy: this, player };
        el.reaction(ctx);
      });

      this.elements = [];
    }
  }

  addShields(count: number) {
    this.shield = Math.max(0, this.shield + count);
  }

  reveal() {}

  startCycle() {}

  endCycle() {}
}
