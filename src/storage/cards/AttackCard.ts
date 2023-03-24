import { Player } from "../../Player";
import { Enemy } from "../enemies/Enemy";
import { Card } from "./Card";

type attackContext = {
  attacker: Player;
  enemy: Enemy;
};

export abstract class AttackCard extends Card {
  abstract attack(ctx: attackContext): void;
}
