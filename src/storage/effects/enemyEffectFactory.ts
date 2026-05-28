import { EEnemyEffect } from "../../types/enums";
import type { Enemy } from "../enemies/Enemy";
import { EnemyEffect } from "./EnemyEffect";
import { NightriderEffect } from "./NightriderEffect";
import { NightriderPlusEffect } from "./NightriderPlusEffect";
import { HeraldOfFrostEffect } from "./HeraldOfFrostEffect";
import { HeraldOfFrostPlusEffect } from "./HeraldOfFrostPlusEffect";

export function createEnemyEffectFromEnum(effect: EEnemyEffect, enemy: Enemy): EnemyEffect | null {
  switch (effect) {
    case EEnemyEffect.Nightrider: return new NightriderEffect(enemy);
    case EEnemyEffect.NightriderPlus: return new NightriderPlusEffect(enemy);
    case EEnemyEffect.HeraldOfFrost: return new HeraldOfFrostEffect();
    case EEnemyEffect.HeraldOfFrostPlus: return new HeraldOfFrostPlusEffect();
    default: return null;
  }
}
