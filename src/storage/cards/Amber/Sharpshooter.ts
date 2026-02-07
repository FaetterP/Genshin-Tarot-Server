import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { SharpshooterPlus } from "./SharpshooterPlus";
import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";

export class Sharpshooter extends Card {
  public get Name(): string {
    return "Sharpshooter";
  }

  constructor() {
    super(0);
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
    let element: string | undefined;

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      element = "Pyro";
      ctx.addToSteps([
        {
          type: "player_change_energy",
          playerId: ctx.player.ID,
          delta: -1,
        },
      ]);
    }

    ctx.addToSteps([
      {
        type: "enemy_take_damage",
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
