import { Enemy } from "../Enemy";

export class CryoRegisvine extends Enemy {
  public get Name() {
    return "CryoRegisvine";
  }

  constructor() {
    const setup = { hp: 7, mora: 7, damage: 3, shield: 3 };
    super(setup);
  }

  // TODO
}
