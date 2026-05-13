import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class YunlaiSwordsmanshipPlus extends Card {
  public get Name(): ECard {
    return ECard.YunlaiSwordsmanshipPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 3,
        isPiercing: false,
        element: EElement.Electro,
      },
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    target.applyAttack({
      damage: 3,
      element: new Electro(),
      player: ctx.player,
    });
    ctx.player.addEnergy(2);
  }
}
