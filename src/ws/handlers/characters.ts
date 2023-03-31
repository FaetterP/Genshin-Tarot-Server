import { ExtWebSocket } from "../../../types/wsTypes";
import { getCharacterByName } from "../../storage/characters";
import { sendToAll } from "../../utils/wsUtils";

async function addCharacter(ws: ExtWebSocket, payload: any) {
  const { character: characterName } = payload as { character: string };
  const Character = getCharacterByName(characterName);

  if (!Character) {
    throw new Error("character not found");
  }

  ws.player.addCharacter(new Character());

  const ret = {
    action: "characters.addCharacter",
    player: ws.player.ID,
    character: characterName,
  };
  await sendToAll(ret);
}

async function removeCharacter(ws: ExtWebSocket, payload: any) {
  const { character: characterName } = payload as { character: string };
  const Character = getCharacterByName(characterName);

  if (!Character) {
    throw new Error("character not found");
  }

  ws.player.removeCharacter(new Character());

  const ret = {
    action: "characters.removeCharacter",
    player: ws.player.ID,
    character: characterName,
  };
  await sendToAll(ret);
}

export default { handlers: { addCharacter, removeCharacter } };
