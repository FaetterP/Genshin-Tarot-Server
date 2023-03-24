type constructorSetup = {
  damage: number;
  isPiercing: boolean;
  isRange: boolean;
  elements: Element[];
};

export class Attack {
  private damage: number;
  private isPiercing: boolean;
  private isRange: boolean;
  private elements: Element[];

  public get Damage() {
    return this.damage;
  }
  public get IsPiercing() {
    return this.isPiercing;
  }
  public get IsRange() {
    return this.isRange;
  }
  public get Elements() {
    return this.elements;
  }

  constructor({ damage, isPiercing, isRange, elements }: constructorSetup) {
    this.damage = damage;
    this.isPiercing = isPiercing;
    this.isRange = isRange;
    this.elements = elements;
  }
}
