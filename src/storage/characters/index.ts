import { Aether } from "./Aether";
import { Lisa } from "./Lisa";
import { NingGuang } from "./NingGuang";
import { Venti } from "./Venti";

const characters = [Aether, Venti, Lisa, NingGuang];

export function getCharacterByName(name: string) {
  const foundCharacter = characters.find((item) => item.name === name);
  return foundCharacter;
}
