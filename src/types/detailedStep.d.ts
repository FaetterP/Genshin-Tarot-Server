import type { CardPrimitive, EnemyPrimitive } from "./general";

export type DetailedStep =
  | { type: "add_card"; playerId: string; card: CardPrimitive, to: "hand" | "deck" | "discard" } //Карта взялась не из колоды, а например из эффекта
  | { type: "discard_card"; playerId: string; card: CardPrimitive }
  | { type: "draw_cards"; playerId: string; cards: CardPrimitive[] }
  | { type: "enemy_take_damage"; enemyId: string; damage: number; isPiercing: boolean; element?: string }
  | { type: "enemy_block_damage"; enemyId: string; element?: string }
  | { type: "enemy_death"; enemyId: string }
  | { type: "enemy_appearance"; playerId: string; enemy: EnemyPrimitive }
  | { type: "player_take_damage"; playerId: string; damage: number; isPiercing: boolean, enemyId?: string }
  | { type: "player_heal"; playerId: string; amount: number }
  | { type: "player_change_energy"; playerId: string; delta: number }
  | { type: "player_change_shield"; playerId: string; delta: number }
  | { type: "player_change_mora"; playerId: string; delta: number }
  | { type: "player_change_action_points"; playerId: string; delta: number }
  | { type: "player_get_effect"; playerId: string; effect: string }
  | { type: "player_lose_effect"; playerId: string; effect: string }
  | { type: "enemy_get_element"; enemyId: string; element: string }
  | { type: "enemy_reaction"; enemyId: string; element1: string; element2: string }
  | { type: "enemy_change_shield"; enemyId: string; delta: number }
  | { type: "enemy_heal"; enemyId: string; amount: number }
  | { type: "upgrade_card"; playerId: string; oldCard: CardPrimitive; newCard: CardPrimitive }
  | { type: "energy_freezed"; playerId: string; delta: number }
  | { type: "trash_card"; playerId: string; card: CardPrimitive }
  | { type: "use_leyline"; name: string }
  | { type: "effect_trigger"; playerId: string; effect: string; isRemove: boolean }
  | { type: "enemy_attack"; enemyId: string; playerId: string; damage: number };
