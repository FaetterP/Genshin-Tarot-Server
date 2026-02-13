import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class OriginPlus extends Card {
  public get Name(): ECard {
    return ECard.OriginPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = target.isContainsElement(EElement.Electro) ? 5 : 2;
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerChangeEnergy,
        playerId: ctx.player.ID,
        delta: 2,
      },
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: EElement.Electro,
      },
    ]);
    ctx.player.addEnergy(2);
    target.applyAttack({
      damage,
      element: new Electro(),
      player: ctx.player,
    });
  }
}
