import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { SpearOfWangsheng } from "../cards/HuTao/SpearOfWangsheng";
import { GuideOfAfterlife } from "../cards/HuTao/GuideOfAfterlife";
import { Character } from "./Character";

export class HuTao extends Character {
  public get Name() {
    return "HuTao";
  }

  constructor() {
    const cards = [
      new SpearOfWangsheng(),
      new SpearOfWangsheng(),
      new SpearOfWangsheng(),
      new GuideOfAfterlife(),
      new GuideOfAfterlife(),
    ];
    super({ cards, burstCost: 6 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
