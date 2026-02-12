import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ECardType } from "../../../types/enums";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class GuhuaStylePlus extends Card {
  public get Name(): string {
    return "GuhuaStylePlus";
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = target.isContainsElement(EElement.Hydro) ? 5 : 3;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: EElement.Hydro,
      },
    ]);
    const attack: Attack = { damage, player: ctx.player };
    if (target.isContainsElement(EElement.Hydro)) {
      attack.element = new Hydro();
    }
    target.applyAttack(attack);
  }
}
