import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class StarfellSwordPlus extends Card {
  public get Name(): string {
    return "StarfellSwordPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const damage = 2;

    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_take_damage" as const,
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
