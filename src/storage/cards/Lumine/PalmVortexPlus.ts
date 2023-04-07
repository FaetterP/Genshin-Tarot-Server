import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Electro } from "../../elements/Electro";
import { Hydro } from "../../elements/Hydro";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class PalmVortexPlus extends Card {
  public get Name(): string {
    return "PalmVortexPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      const elements = enemy.Elements.map((element) => element.Name);

      if (
        elements.includes(new Hydro().Name) ||
        elements.includes(new Pyro().Name) ||
        elements.includes(new Cryo().Name) ||
        elements.includes(new Electro().Name)
      ) {
        const attack: Attack = {
          damage: 4,
          player: ctx.player,
        };
        enemy.applyAttack(attack);
      }
    }
  }
}
