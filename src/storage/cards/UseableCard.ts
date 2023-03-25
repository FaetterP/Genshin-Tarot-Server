import { Player } from "../../game/Player";
import { Card } from "./Card";

type useContext = {
  player: Player;
};

export abstract class UseableCard extends Card {
  abstract use(ctx: useContext): void;
}
