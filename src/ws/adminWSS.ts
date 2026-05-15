import WebSocket from "ws";
import { createOnAdminConnect } from "./handlers/admin";
import {
  sendStateToClients,
  cycleController,
  getGameStateSnapshot,
  registerAdminWss,
} from "./gameWSS";

const ADMIN_PORT = 8998;

let adminWss: WebSocket.Server;

export async function startAdminWSS(port = ADMIN_PORT): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    adminWss = new WebSocket.Server({ port }, () => resolve());
    adminWss.on(
      "connection",
      createOnAdminConnect({
        cycleController,
        getGameStateSnapshot,
        sendStateToClients: sendStateToClients,
        sendStateToAdmin: (ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: "admin.state", ...getGameStateSnapshot() }));
          }
        },
      }),
    );
    adminWss.on("error", reject);
  });

  registerAdminWss(adminWss);

  console.log(`Admin WebSocket: ws://localhost:${ADMIN_PORT}`);
}

export function stopAdminWSS() {
  adminWss.close();
}
