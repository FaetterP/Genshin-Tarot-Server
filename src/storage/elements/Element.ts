import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";

export type elementReactionContext = {
  player: Player;
  enemy: Enemy;
};

export abstract class Element {
  abstract reaction(ctx: elementReactionContext): void;
}
