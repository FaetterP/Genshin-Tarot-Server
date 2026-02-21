import type { CardPrimitive, EnemyPrimitive } from "./general";
import type { EDetailedStep, EElement, EEnemyEffect, ELeyline, EPlayerEffect } from "./enums";

export type DetailedStep =
  | {
      type: EDetailedStep.AddCard;
      playerId: string;
      card: CardPrimitive;
      to: "hand" | "deck" | "discard";
    }
  | { type: EDetailedStep.DiscardCard; playerId: string; card: CardPrimitive }
  | { type: EDetailedStep.DrawCards; playerId: string; cards: CardPrimitive[] }
  | {
      type: EDetailedStep.EnemyTakeDamage;
      enemyId: string;
      damage: number;
      isPiercing: boolean;
      element?: EElement;
    }
  | { type: EDetailedStep.EnemyBlockDamage; enemyId: string; element?: EElement }
  | { type: EDetailedStep.EnemyDeath; enemyId: string }
  | { type: EDetailedStep.EnemyAppearance; playerId: string; enemy: EnemyPrimitive }
  | {
      type: EDetailedStep.PlayerTakeDamage;
      playerId: string;
      damage: number;
      isPiercing: boolean;
      enemyId?: string;
    }
  | { type: EDetailedStep.PlayerHeal; playerId: string; amount: number }
  | { type: EDetailedStep.PlayerChangeEnergy; playerId: string; delta: number }
  | { type: EDetailedStep.PlayerChangeShield; playerId: string; delta: number }
  | { type: EDetailedStep.PlayerChangeMora; playerId: string; delta: number }
  | { type: EDetailedStep.PlayerChangeActionPoints; playerId: string; delta: number }
  | { type: EDetailedStep.PlayerGetEffect; playerId: string; effect: EPlayerEffect }
  | { type: EDetailedStep.PlayerLoseEffect; playerId: string; effect: EPlayerEffect }
  | { type: EDetailedStep.EnemyGetElement; enemyId: string; element: EElement }
  | { type: EDetailedStep.EnemyReaction; enemyId: string; element1: EElement; element2: EElement }
  | { type: EDetailedStep.EnemyChangeShield; enemyId: string; delta: number }
  | { type: EDetailedStep.EnemyHeal; enemyId: string; amount: number }
  | {
      type: EDetailedStep.UpgradeCard;
      playerId: string;
      oldCard: CardPrimitive;
      newCard: CardPrimitive;
    }
  | { type: EDetailedStep.EnergyFreezed; playerId: string; delta: number }
  | { type: EDetailedStep.TrashCard; playerId: string; card: CardPrimitive }
  | { type: EDetailedStep.UseLeyline; name: ELeyline }
  | {
      type: EDetailedStep.EffectTrigger;
      playerId: string;
      effect: EPlayerEffect;
      isRemove: boolean;
    }
  | { type: EDetailedStep.EnemyAttack; enemyId: string; playerId: string; damage: number }
  | { type: EDetailedStep.EnemyGetEffect; enemyId: string; effect: EEnemyEffect }
  | { type: EDetailedStep.EnemyLoseEffect; enemyId: string; effect: EEnemyEffect }
  | {
      type: EDetailedStep.EnemyEffectTrigger;
      enemyId: string;
      effect: EEnemyEffect;
      isRemove: boolean;
    }
  | { type: EDetailedStep.EnemiesSwap; playerId: string; enemyId1: string; enemyId2: string };
