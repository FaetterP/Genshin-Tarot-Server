import {
  EnemyDeathContext,
  PlayerEndsWavesContext,
} from "../../types/eventsContext";
import { Card } from "../storage/cards/Card";
import { Character } from "../storage/characters/Character";
import { Enemy } from "../storage/enemies/Enemy";
import { SmallCryoSlime } from "../storage/enemies/normal/SmallCryoSlime";
import { Event } from "../utils/Event";
import { clamp } from "../utils/math";
import characters from "../ws/handlers/characters";

export class Player {
  private hp: number = 0;
  private energy: number = 0;
  private shield: number = 0;
  private mora: number = 0;

  private enemies: Enemy[] = [];
  private wave: number = 0;
  private actionPoints: number = 0;
  private extraActionPoints: number = 0;
  private isTurnEnds: boolean = true;

  private hand: Card[] = [];
  private discardDeck: Card[] = [];
  private collectingDeck: Card[] = [];

  private characters: Character[] = [];

  private e_onWavesDefeated = new Event<PlayerEndsWavesContext>();

  public get Enemies(): ReadonlyArray<Enemy> {
    return this.enemies;
  }
  public get ActionPoints() {
    return {
      actionPoints: this.actionPoints,
      extraActionPoints: this.extraActionPoints,
      total: this.actionPoints + this.extraActionPoints,
    };
  }
  public get Characters(): ReadonlyArray<Character> {
    return this.characters;
  }

  public addCharacter(character: Character) {
    if (this.characters.map((item) => item.Name).includes(character.Name)) {
      throw new Error("duplicate character");
    }

    if (this.characters.length >= 4) {
      throw new Error("maximum characters");
    }

    this.characters.push(character);
  }

  public removeCharacter(character: Character) {
    if (!this.characters.map((item) => item.Name).includes(character.Name)) {
      throw new Error("no have character");
    }

    this.characters = this.characters.filter(
      (item) => item.Name !== character.Name
    );
  }

  public startGame() {
    for (const character of this.characters) {
      this.hand.push(...character.Cards);
    }

    this.hp = 12;
  }

  public applyDamage(damage: number) {
    if (this.shield >= damage) {
      this.shield -= damage;
      return;
    }

    damage -= this.shield;
    this.shield = 0;
    this.hp -= damage;

    if (this.hp <= 0) {
      // TODO
    }
  }

  public addEnergy(count: number) {
    this.energy = clamp(this.energy + count, 0, 12);
  }

  public trySpendEnergy(count: number): boolean {
    if (this.energy < count) {
      return false;
    }

    this.energy -= count;
    return true;
  }

  public addShield(count: number) {
    this.shield = clamp(this.shield + count, 0, 12);
  }

  public addExtraActionPoints(count: number) {
    this.extraActionPoints = clamp(this.extraActionPoints + count, 0, 3);
  }
  public addActionPoints(count: number) {
    this.actionPoints = clamp(this.actionPoints + count, 0, 3);
  }

  public createWave() {
    if (this.wave >= 5) {
      this.e_onWavesDefeated.Invoke({ player: this });
      return;
    }

    if (this.enemies.length > 0) {
      return;
    }

    this.enemies = [];
    const count = [1, 2, 3, 2, 3][this.wave];
    for (let i = 0; i < count; i++) {
      // TODO
      const addedEnemy: Enemy = new SmallCryoSlime();
      addedEnemy.OnDeath.addListener(this.enemyDeathHandler);
      this.enemies.push();
    }

    this.wave++;
  }

  public drawCard() {
    // TODO
  }

  public discardRandomCard() {
    // TODO
  }

  public addCardToDiscard(card: Card) {
    this.discardDeck.push(card);
  }

  public startCycle() {
    if (this.enemies.length === 0) {
      this.createWave();
    }

    this.isTurnEnds = false;

    this.shield = 0;
    this.actionPoints = 3;
    this.extraActionPoints = 0;

    for (let i = 0; i < 5; i++) {
      this.drawCard();
    }

    for (const enemy of this.enemies) {
      enemy.startCycle();
    }
  }

  public endCycle() {
    for (let i = 0; i < this.hand.length; i++) {
      this.discardRandomCard();
    }

    for (const enemy of this.enemies) {
      enemy.endCycle();
    }
  }

  /* Subscribes */

  private enemyDeathHandler({ enemy }: EnemyDeathContext) {
    this.enemies = this.enemies.filter((item) => item !== enemy);

    if (this.enemies.length === 0) {
      this.createWave();
    }
  }
}
