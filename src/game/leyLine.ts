import { Freeze } from "../storage/cards/misc/Freeze";
import { Cryo } from "../storage/elements/Cryo";
import { Electro } from "../storage/elements/Electro";
import { Hydro } from "../storage/elements/Hydro";
import { Pyro } from "../storage/elements/Pyro";
import { getRandomElement } from "../utils/arrays";
import { Player } from "./Player";

function EngulfingStorm(players: Player[]) {
  for (const player of players) {
    player.applyDamage(1); // TODO piercing damage
  }
}

function SmolderingFlames(players: Player[]) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Pyro(), player);
      }
    }
    // TODO add Burn to discard
  }
}

function MonsterAttendants() {
  // all enemies have their damage fully removed
}

function Adrenaline(players: Player[]) {
  for (const player of players) {
    if (player.Health <= 7) {
      // TODO add overheat to hand
    }
  }
}

function CondensedIce(players: Player[]) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Cryo(), player);
      }
    }
    player.addCardToDiscard(new Freeze());
  }
}

function LightingBolts(players: Player[]) {
  for (const player of players) {
    player.trySpendEnergy(2);
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Electro(), player);
      }
    }
  }
}

function ReinforcedShields(players: Player[]) {
  for (const player of players) {
    player.addShield(3);
  }
}

function ElementalRefresh(players: Player[]) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      // TODO delete elements
    }
  }
}

function SlowingWater(players: Player[]) {
  for (const player of players) {
    // TODO player drop random card
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Hydro(), player);
      }
    }
  }
}

function ChaosCluster(players: Player[]) {
  for (const player of players) {
    if (player.Energy >= 5) {
      player.applyDamage(2);
    }
  }
}

function HighEnergyCores(players: Player[]) {
  for (const player of players) {
    if (player.Energy >= 5) {
      player.addHealth(1);
    }
  }
}

function IcicleBlast(players: Player[]) {
  for (const player of players) {
    // TODO trash all Freeze in hand, apply 1 piercing damage per card
  }
}

function PlasmaField(players: Player[]) {
  for (const player of players) {
    if (player.Energy === 0) {
      player.addEnergy(3);
    }
  }
}

function EnergyTides(players: Player[]) {
  for (const player of players) {
    if (player.Energy >= 5) {
      player.addEnergy(-2);
    } else {
      player.addEnergy(2);
    }
  }
}

function WindCurrent(players: Player[]) {
  for (const player of players) {
    if (player.Health <= 7) {
      // TODO add Dash to hand
    }
  }
}

function SheerCold() {
  // TODO all players without Freeze in hand take Freeze to top deck
}

export function useRandomEffect(players: Player[]) {
  const effects: ((players: Player[]) => void)[] = [
    EngulfingStorm,
    SmolderingFlames,
    MonsterAttendants,
    Adrenaline,
    CondensedIce,
    LightingBolts,
    ReinforcedShields,
    ElementalRefresh,
    SlowingWater,
    ChaosCluster,
    HighEnergyCores,
    IcicleBlast,
    PlasmaField,
    EnergyTides,
    WindCurrent,
    SheerCold,
  ];

  const effect = getRandomElement(effects);
  effect(players);
}
