import { EElement } from "../../types/enums";
import { BaseElement } from "./BaseElement";
import { Anemo } from "./Anemo";
import { Cryo } from "./Cryo";
import { Electro } from "./Electro";
import { Geo } from "./Geo";
import { Hydro } from "./Hydro";
import { Pyro } from "./Pyro";

export function createElementFromEnum(element: EElement): BaseElement | null {
  switch (element) {
    case EElement.Anemo: return new Anemo();
    case EElement.Cryo: return new Cryo();
    case EElement.Electro: return new Electro();
    case EElement.Geo: return new Geo();
    case EElement.Hydro: return new Hydro();
    case EElement.Pyro: return new Pyro();
    default: return null;
  }
}
