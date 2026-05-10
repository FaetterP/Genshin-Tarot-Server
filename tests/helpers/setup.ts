import { CycleController } from "../../src/game/CycleController";
import { Player } from "../../src/game/Player";
import { ExtWebSocket } from "../../src/types/wsTypes";

export function createGameState() {
  const cycleController = new CycleController();
  const player = new Player(cycleController);
  cycleController.connectPlayer(player);
  player.adminSetStats({ hp: 12, actionPoints: { normal: 3, extra: 0 } });
  return { cycleController, player };
}

export function makeWs(player: Player, cycleController: CycleController): ExtWebSocket {
  return { player, cycleController } as ExtWebSocket;
}
