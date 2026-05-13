import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { SharpshooterPlus } from "./SharpshooterPlus";
import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";

export class Sharpshooter extends Card {
  public get Name(): ECard {
    return ECard.Sharpshooter;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  get Upgrade() {
    return SharpshooterPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    let damage = 1;
    const isPiercing = true;
    let element: EElement | undefined;

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = EElement.Pyro;
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: -1,
        },
      ]);
    }

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing,
        element,
      },
    ]);

    const attack: Attack = {
      damage,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };
    if (element) attack.element = new Pyro();
    target.applyAttack(attack);
  }
}
