import { Card } from "../storage/cards/Card";
import { Enemy } from "../storage/enemies/Enemy";
import { Event } from "../utils/Event";
import { clamp } from "../utils/math";

export class Player {
  private hp: number = 0;
  private energy: number = 0;
  private shield: number = 0;
  private mora: number = 0;

  private enemies: Enemy[] = [];
  private wave: number = 0;

  private hand: Card[] = [];
  private discardDeck: Card[] = [];
  private collectingDeck: Card[] = [];

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

  public drawCard() {
    // TODO
  }

  public addCardToDiscard(card: Card) {
    this.discardDeck.push(card);
  }
}
