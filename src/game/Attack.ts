import { Player } from "./Player";
import { Element } from "../storage/elements/Element";

export type constructorSetupAttack = {
  damage: number;
  isPiercing?: boolean;
  isRange?: boolean;
  element?: Element;
  player: Player;
};

export class Attack {
  private damage: number;
  private isPiercing?: boolean;
  private isRange?: boolean;
  private element?: Element;
  private player: Player;

  public get Damage() {
    return this.damage;
  }
  public get IsPiercing() {
    return this.isPiercing;
  }
  public get IsRange() {
    return this.isRange;
  }
  public get Element() {
    return this.element;
  }
  public get Player() {
    return this.player;
  }

  constructor({
    damage,
    isPiercing,
    isRange,
    element,
    player,
  }: constructorSetupAttack) {
    this.damage = damage;
    this.isPiercing = isPiercing;
    this.isRange = isRange;
    this.element = element;
    this.player = player;
  }
}
