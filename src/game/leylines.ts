import { Burn } from "../storage/cards/misc/Burn";
import { Dash } from "../storage/cards/misc/Dash";
import { Freeze } from "../storage/cards/misc/Freeze";
import { Overheat } from "../storage/cards/misc/Overheat";
import { Cryo } from "../storage/elements/Cryo";
import { Electro } from "../storage/elements/Electro";
import { Hydro } from "../storage/elements/Hydro";
import { Pyro } from "../storage/elements/Pyro";
import { getRandomElement } from "../utils/arrays";
import { Player } from "./Player";

function EngulfingStorm(players: Player[]) {
  for (const player of players) {
    player.applyDamage(1, true);
  }
}

function SmolderingFlames(players: Player[]) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Pyro(), player);
      }
    }
    player.addCardToDiscard(new Burn());
  }
}

function MonsterAttendants() {
  // all enemies have their damage fully removed
}

function Adrenaline(players: Player[]) {
  for (const player of players) {
    if (player.Health <= 7) {
      player.addCardToHand(new Overheat());
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
      enemy.clearElements();
    }
  }
}

function SlowingWater(players: Player[]) {
  for (const player of players) {
    player.discardRandomCard();
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
      player.addCardToHand(new Dash());
    }
  }
}

function SheerCold() {
  // TODO all players without Freeze in hand take Freeze to top deck
}

export function getRandomEffect() {
  const effects: {
    use: (players: Player[]) => void;
    name: string;
  }[] = [
    { use: EngulfingStorm, name: "EngulfingStorm" },
    { use: SmolderingFlames, name: "SmolderingFlames" },
    { use: MonsterAttendants, name: "MonsterAttendants" },
    { use: Adrenaline, name: "Adrenaline" },
    { use: CondensedIce, name: "CondensedIce" },
    { use: LightingBolts, name: "LightingBolts" },
    { use: ReinforcedShields, name: "ReinforcedShields" },
    { use: ElementalRefresh, name: "ElementalRefresh" },
    { use: SlowingWater, name: "SlowingWater" },
    { use: ChaosCluster, name: "ChaosCluster" },
    { use: HighEnergyCores, name: "HighEnergyCores" },
    { use: IcicleBlast, name: "IcicleBlast" },
    { use: PlasmaField, name: "PlasmaField" },
    { use: EnergyTides, name: "EnergyTides" },
    { use: WindCurrent, name: "WindCurrent" },
    { use: SheerCold, name: "SheerCold" },
  ];

  const effect = getRandomElement(effects);
  return effect;
}
