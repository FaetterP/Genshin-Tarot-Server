import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { CuttingTorrentPlus } from "./CuttingTorrentPlus";

export class CuttingTorrent extends Card {
  public get Name(): ECard {
    return ECard.CuttingTorrent;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  get Upgrade() {
    return CuttingTorrentPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let element: EElement | undefined;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = EElement.Hydro;
    }
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element,
      },
    ]);
    const attack: Attack = {
      damage: 1,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };
    if (element) attack.element = new Hydro();
    target.applyAttack(attack);
  }
}
