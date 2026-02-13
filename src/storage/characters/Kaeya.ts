import { CharacterUseBurstContext } from "../../types/functionsContext";
import { CeremonialBladework } from "../cards/Kaeya/CeremonialBladework";
import { Frostgnaw } from "../cards/Kaeya/Frostgnaw";
import { ECharacter } from "../../types/enums";
import { Character } from "./Character";

export class Kaeya extends Character {
  public get Name() {
    return ECharacter.Kaeya;
  }

  constructor() {
    const cards = [
      new CeremonialBladework(),
      new CeremonialBladework(),
      new CeremonialBladework(),
      new Frostgnaw(),
      new Frostgnaw(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    const card = ctx.player.drawCard();
    // TODO if card is action, it cost 0 ap
  }
}
