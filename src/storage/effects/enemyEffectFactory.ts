import { EEnemyEffect } from "../../types/enums";
import type { Enemy } from "../enemies/Enemy";
import { EnemyEffect } from "./EnemyEffect";
import { NightriderEffect } from "./NightriderEffect";
import { NightriderPlusEffect } from "./NightriderPlusEffect";

export function createEnemyEffectFromEnum(effect: EEnemyEffect, enemy: Enemy): EnemyEffect | null {
  switch (effect) {
    case EEnemyEffect.Nightrider: return new NightriderEffect(enemy);
    case EEnemyEffect.NightriderPlus: return new NightriderPlusEffect(enemy);
    default: return null;
  }
}
