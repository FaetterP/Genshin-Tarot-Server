import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class Kaboom extends Card {
  public get Name(): string {
    return "Kaboom";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
      element: new Pyro(),
    };
    ctx.enemy.applyAttack(attack);

    ctx.player.addEnergy(1);
  }
}
