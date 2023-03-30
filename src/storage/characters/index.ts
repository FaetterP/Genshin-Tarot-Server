import { Aether } from "./Aether";

const characters = [Aether];

export function getCharacterByName(name: string) {
  const foundCharacter = characters.find((item) => item.name === name);
  return foundCharacter;
}
