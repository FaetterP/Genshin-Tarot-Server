import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { StrikeOfFortunePlus } from "./StrikeOfFortunePlus";

export class StrikeOfFortune extends Card {
  public get Name(): string {
    return "StrikeOfFortune";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return StrikeOfFortunePlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 2;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: "Pyro",
      },
    ]);
    if (target.isContainsElement(new Pyro())) {
      ctx.addToSteps([{
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      }]);
    }

    const attack: Attack = {
      damage,
      element: new Pyro(),
      player: ctx.player,
    };
    target.applyAttack(attack);
    if (target.isContainsElement(new Pyro())) {
      ctx.player.addEnergy(2);
    }
  }
}
