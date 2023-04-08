import { Player } from "../../game/Player";
import { Event } from "../../utils/Event";
import { Element } from "../elements/Element";
import { EnemyDeathContext } from "../../../types/eventsContext";
import { v4 } from "uuid";
import { Attack, EnemyPrimitive } from "../../../types/general";
import { Cryo } from "../elements/Cryo";
import { Hydro } from "../elements/Hydro";

type constructorSetup = {
  hp: number;
  damage: number;
  mora: number;
  shield: number;
};

export abstract class Enemy {
  abstract get Name(): string;
  public readonly ID: string;
  private hp: number;
  private shield: number;
  protected elements: Element[] = [];
  private isStunned: boolean = false;

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

  getPrimitiveStats(): EnemyPrimitive {
    const elements: string[] = [];

    for (const element of this.elements) {
      elements.push(element.Name);
    }

    return {
      id: this.ID,
      name: this.Name,
      hp: this.hp,
      shield: this.shield,
      elements,
      isStunned: this.isStunned,
    };
  }

  applyAttack(attack: Attack) {
    if (!attack.isRange && !attack.player.Enemies.includes(this)) {
      throw new Error("attack not range");
    }

    if (this.shield <= 0 || attack.isPiercing) {
      this.hp -= attack.damage;
    }

    if (attack.element) {
      this.applyElement(attack.element, attack.player);
    }

    attack.player.useAttackEffects(this);

    if (this.hp <= 0) {
      this.e_onDeath.Invoke({ enemy: this });
    }
  }

  applyElement(element: Element, player: Player) {
    if (element instanceof Cryo || element instanceof Hydro) {
      // TODO player drop all Burn cards
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

  addStun() {
    this.isStunned = true;
  }

  reveal() {}

  startCycle() {
    this.isStunned = false;
  }

  endCycle() {}
}
