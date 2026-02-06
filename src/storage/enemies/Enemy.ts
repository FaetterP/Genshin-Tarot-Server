import { Player } from "../../game/Player";
import { Event } from "../../utils/Event";
import { Element } from "../elements/Element";
import {
  EnemyDeathContext,
  EnemyEndCycleContext,
  EnemyStartCycleContext,
} from "../../types/eventsContext";
import { v4 } from "uuid";
import { Attack, EnemyPrimitive } from "../../types/general";
import { Cryo } from "../elements/Cryo";
import { Hydro } from "../elements/Hydro";
import { EnemyEffect } from "../effects/EnemyEffect";

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
  private damage: number;
  private mora: number;
  protected elements: Element[] = [];
  private isStunned: boolean = false;
  private effects: EnemyEffect[] = [];

  private e_onDeath = new Event<EnemyDeathContext>();
  private e_onStartCycle = new Event<EnemyStartCycleContext>();
  private e_onEndCycle = new Event<EnemyEndCycleContext>();

  public get Health() {
    return this.hp;
  }
  public get Damage() {
    return this.damage;
  }
  public get Mora() {
    return this.mora;
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
  public get OnStartCycle() {
    return {
      addListener: this.e_onStartCycle.AddListener.bind(this.e_onStartCycle),
      removeListener: this.e_onStartCycle.RemoveListener.bind(this.e_onStartCycle),
    };
  }
  public get OnEndCycle() {
    return {
      addListener: this.e_onEndCycle.AddListener.bind(this.e_onEndCycle),
      removeListener: this.e_onEndCycle.RemoveListener.bind(this.e_onEndCycle),
    };
  }

  constructor({ hp, damage, mora, shield }: constructorSetup) {
    this.ID = `enemy-${v4()}`;
    this.hp = hp;
    this.shield = shield;
    this.damage = damage;
    this.mora = mora;
  }

  getPrimitiveStats(): EnemyPrimitive {
    const elements: string[] = [];

    for (const element of this.elements) {
      elements.push(element.Name);
    }

    const effectNames = this.effects.map((e) => e.Name);

    return {
      id: this.ID,
      name: this.Name,
      hp: this.hp,
      shield: this.shield,
      elements,
      isStunned: this.isStunned,
      effects: effectNames,
    };
  }

  public addEffect(effect: EnemyEffect) {
    this.effects.push(effect);
  }

  public hasEffect(effectName: string): boolean {
    return this.effects.some((e) => e.Name === effectName);
  }

  applyAttack(attack: Attack) {
    if (this.Health <= 0) {
      return;
    }

    if (!attack.isRange && !attack.player.Enemies.includes(this)) {
      throw new Error("attack not range");
    }

    const bonus = attack.player.getAndConsumeNextAttackBonus();
    const totalDamage = attack.damage + bonus.bonusDamage;

    if (bonus.bonusDamage > 0) {
      attack.player.addSteps([
        {
          type: "enemy_take_damage",
          enemyId: this.ID,
          damage: bonus.bonusDamage,
          isPiercing: attack.isPiercing ?? false,
          element: attack.element?.Name,
        },
      ]);
    }

    if (this.shield <= 0 || attack.isPiercing) {
      this.hp -= totalDamage;
    } else {
      attack.player.recordEnemyBlockDamage(
        this.ID,
        attack.element?.Name
      );
    }

    if (attack.element) {
      this.applyElement(attack.element, attack.player);
    }

    attack.player.useAttackEffects(this);

    if (this.hp <= 0) {
      if (bonus.energyOnKill > 0) {
        attack.player.addEnergy(bonus.energyOnKill);
      }
      attack.player.recordEnemyDeath(this.ID);
      this.death();
      this.e_onDeath.Invoke({ enemy: this });
    }
  }

  death() {}

  applyElement(element: Element, player: Player) {
    if (this.Health <= 0) {
      return;
    }

    if (element instanceof Cryo || element instanceof Hydro) {
      player.trashAllBurnCardsInHand();
    }

    this.elements = [...this.elements, element];

    if (this.elements.length >= 2) {
      player.recordEnemyReaction(
        this.ID,
        this.elements[0].Name,
        this.elements[1].Name
      );
      this.addShields(-1);

      this.elements.forEach((el) => {
        const ctx = { enemy: this, player };
        el.reaction(ctx);
      });

      this.elements = [];
    }
  }

  isContainsElement(element: Element) {
    return this.elements.map((el) => el.Name).includes(element.Name);
  }

  clearElements() {
    this.elements = [];
  }

  addShields(count: number) {
    this.shield = Math.max(0, this.shield + count);
  }

  addStun() {
    this.isStunned = true;
  }

  reveal() {}

  startCycle(ctx: EnemyStartCycleContext) {
    this.isStunned = false;
    this.e_onStartCycle.Invoke(ctx);

    const toRemove: EnemyEffect[] = [];
    for (const effect of this.effects) {
      const isRemove = effect.onStartCycle(ctx);
      ctx.addToSteps([
        {
          type: "enemy_effect_trigger",
          enemyId: this.ID,
          effect: effect.Name,
          isRemove,
        },
      ]);
      if (isRemove) {
        toRemove.push(effect);
        ctx.addToSteps([
          { type: "enemy_lose_effect", enemyId: this.ID, effect: effect.Name },
        ]);
      }
    }
    this.effects = this.effects.filter((e) => !toRemove.includes(e));
  }

  endCycle(ctx: EnemyEndCycleContext) {
    this.e_onEndCycle.Invoke(ctx);
  }
}
