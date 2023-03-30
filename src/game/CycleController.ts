import { Event } from "../utils/Event";
import { Player } from "./Player";

export class CycleController {
  private players: Player[] = [];
  private cycle: number = 0;
  private isGameStart: boolean = false;

  private e_onCyclesEnd = new Event();

  public get PlayersCount() {
    return this.players.length;
  }
  public get CycleNumber() {
    return this.cycle;
  }
  public get IsGameStart() {
    return this.isGameStart;
  }
  public get OnCyclesEnd() {
    return {
      addListener: this.e_onCyclesEnd.AddListener.bind(this.e_onCyclesEnd),
      removeListener: this.e_onCyclesEnd.RemoveListener.bind(
        this.e_onCyclesEnd
      ),
    };
  }

  connectPlayer(player: Player) {
    if (this.players.length >= 4) {
      throw new Error("maximum players count");
    }

    if (this.players.includes(player)) {
      throw new Error("player already connected");
    }

    this.players.push(player);
  }

  startGame() {
    if (this.isGameStart) {
      throw new Error("game already started");
    }

    if (this.players.length === 0) {
      throw new Error("cannot start game without players");
    }

    for (const player of this.players) {
      if (player.Characters.length < 4) {
        throw new Error("player doesn't have 4 characters");
      }
    }

    for (const player of this.players) {
      player.startGame();
    }

    this.isGameStart = true;

    this.cycle = 1;
    this.startCycle();
  }

  startCycle() {
    if (this.cycle === 13) {
      this.e_onCyclesEnd.Invoke(null);
    }

    for (const player of this.players) {
      player.startCycle();
    }
  }

  endCycle() {
    for (const player of this.players) {
      player.endCycle();
    }
    this.cycle += 1;
  }

  playerEndTurn(player: Player) {}
}
