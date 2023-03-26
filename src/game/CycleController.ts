import { Event } from "../utils/Event";
import { Player } from "./Player";

export class CycleController {
  private players: Player[] = [];
  private cycle: number = 1;

  private e_onCyclesEnd = new Event();

  startGame() {}

  endCycle() {
    for (const player of this.players) {
      player.endCycle();
      for (const enemy of player.Enemies) {
        enemy.endCycle();
      }
    }
    this.cycle += 1;
  }

  startCycle() {
    if (this.cycle === 13) {
      this.e_onCyclesEnd.Invoke(null);
    }

    for (const player of this.players) {
      player.startCycle();
      for (const enemy of player.Enemies) {
        enemy.startCycle();
      }
    }
  }

  playerEndTurn(player: Player) {}
}
