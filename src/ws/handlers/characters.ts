import { ExtWebSocket } from "../../types/wsTypes";
import { getCharacterByName } from "../../storage/characters";
import { CharactersAddCharacterRequest, CharactersRemoveCharacterRequest } from "../../types/request";
import { CharactersAddCharacterResponse, CharactersRemoveCharacterResponse } from "../../types/response";
import { sendToAll } from "../../utils/wsUtils";

async function addCharacter(ws: ExtWebSocket, payload: any) {
  const { character: characterName } = payload as CharactersAddCharacterRequest;
  const Character = getCharacterByName(characterName);

  if (!Character) {
    throw new Error("character not found");
  }

  ws.player.addCharacter(new Character());

  sendToAll<CharactersAddCharacterResponse>({
    action: "characters.addCharacter",
    player: ws.player.ID,
    character: characterName,
  });
}

async function removeCharacter(ws: ExtWebSocket, payload: any) {
  const { character: characterName } = payload as CharactersRemoveCharacterRequest;
  const Character = getCharacterByName(characterName);

  if (!Character) {
    throw new Error("character not found");
  }

  ws.player.removeCharacter(new Character());

  sendToAll<CharactersRemoveCharacterResponse>({
    action: "characters.removeCharacter",
    player: ws.player.ID,
    character: characterName,
  });
}

export default { handlers: { addCharacter, removeCharacter } };
