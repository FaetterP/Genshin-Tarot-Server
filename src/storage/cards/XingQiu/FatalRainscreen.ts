import { CardAttackContext } from "../../../../types/functionsContext";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class FatalRainscreen extends AttackCard {
  public get Name(): string {
    return "FatalRainscreen";
  }

  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Hydro(), ctx.attacker);
    ctx.attacker.addShield(4);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
    }
  }
}
