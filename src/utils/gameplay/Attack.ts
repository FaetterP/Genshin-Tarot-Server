import { Element } from "../../storage/elements/Element";

type constructorSetup = {
  damage: number;
  isPiercing: boolean;
  isRange: boolean;
  element: Element;
};

export class Attack {
  private damage: number;
  private isPiercing: boolean;
  private isRange: boolean;
  private element: Element;

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

  constructor({ damage, isPiercing, isRange, element }: constructorSetup) {
    this.damage = damage;
    this.isPiercing = isPiercing;
    this.isRange = isRange;
    this.element = element;
  }
}
