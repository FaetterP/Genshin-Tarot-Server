import { Enemy } from "../Enemy";

export class CryoCicinSwarm extends Enemy {
  public get Name() {
    return "CryoCicinSwarm";
  }

  constructor() {
    const setup = { hp: 3, mora: 3, damage: 1, shield: 0 };
    super(setup);
  }

  // TODO
}
