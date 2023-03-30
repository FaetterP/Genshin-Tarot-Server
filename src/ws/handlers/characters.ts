import { ExtWebSocket } from "../../../types/wsTypes";
import { getCharacterByName } from "../../storage/characters";

async function addCharacter(ws: ExtWebSocket, payload: any) {
  const { character: characterName } = payload as { character: string };
  const Character = getCharacterByName(characterName);

  if (!Character) {
    throw new Error("character not found");
  }

  ws.player.addCharacter(new Character());
}

async function removeCharacter(ws: ExtWebSocket, payload: any) {
  const { character: characterName } = payload as { character: string };
  const Character = getCharacterByName(characterName);

  if (!Character) {
    throw new Error("character not found");
  }

  ws.player.removeCharacter(new Character());
}

export default { handlers: { addCharacter, removeCharacter } };
