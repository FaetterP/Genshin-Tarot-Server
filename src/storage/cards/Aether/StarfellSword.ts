import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";
import { StarfellSwordPlus } from "./StarfellSwordPlus";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";

export class StarfellSword extends Card {
  public get Name(): string {
    return "StarfellSword";
  }

  constructor() {
    super(2);
  }

  get Upgrade() {
    return StarfellSwordPlus;
  }

  use(ctx: CardUseContext): void {
    const damage = 2;

    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_take_damage",
        enemyId: enemy.ID,
        damage,
        isPiercing: true,
        element: "Geo",
      }))
    );

    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage,
        isPiercing: true,
        element: new Geo(),
        player: ctx.player,
      };

      enemy.applyAttack(attack);
    }
  }
}
