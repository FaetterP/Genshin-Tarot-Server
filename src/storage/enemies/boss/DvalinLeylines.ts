import { Player } from "../../../game/Player";
import { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ELeyline } from "../../../types/enums";
import { Burn } from "../../cards/misc/Burn";
import { Dash } from "../../cards/misc/Dash";
import { Freeze } from "../../cards/misc/Freeze";
import { Overheat } from "../../cards/misc/Overheat";
import { Cryo } from "../../elements/Cryo";
import { Electro } from "../../elements/Electro";
import { Hydro } from "../../elements/Hydro";
import { Pyro } from "../../elements/Pyro";
import { LeylineEntry } from "../BossEnemy";

function EngulfingStorm(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    player.applyDamage(1, true);
    addToSteps([{
      type: EDetailedStep.PlayerTakeDamage,
      playerId: player.ID,
      damage: 1,
      isPiercing: true,
    }]);
  }
}

function SmolderingFlames(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Pyro(), player);
        addToSteps([{
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Pyro,
        }]);
      }
    }
    const burn = new Burn();
    player.addCardToDiscard(burn);
    addToSteps([{
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: burn.getPrimitive(),
    }]);
  }
}

function MonsterAttendants(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      const amount = enemy.healToMax();
      if (amount > 0) {
        addToSteps([{
          type: EDetailedStep.EnemyHeal,
          enemyId: enemy.ID,
          amount,
        }]);
      }
    }
  }
}

function Adrenaline(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    if (player.Health <= 7) {
      const overheat = new Overheat();
      player.addCardToHand(overheat);
      addToSteps([{
        type: EDetailedStep.MoveCard,
        to: "hand",
        playerId: player.ID,
        card: overheat.getPrimitive(),
      }]);
    }
  }
}

function CondensedIce(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Cryo(), player);
        addToSteps([{
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Cryo,
        }]);
      }
    }
    const freeze = new Freeze();
    player.addCardToDiscard(freeze);
    addToSteps([{
      type: EDetailedStep.MoveCard,
      to: "discard",
      playerId: player.ID,
      card: freeze.getPrimitive(),
    }]);
  }
}

function LightingBolts(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    if (player.Hand.some((card) => card.Name === ECard.Freeze)) {
      addToSteps([{ type: EDetailedStep.EnergyFreezed, playerId: player.ID }]);
    } else if (player.trySpendEnergy(2)) {
      addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.ID,
        delta: -2,
      }]);
    }
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Electro(), player);
        addToSteps([{
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Electro,
        }]);
      }
    }
  }
}

function ReinforcedShields(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    const shieldBefore = player.Shields;
    player.addShield(3);
    const delta = player.Shields - shieldBefore;
    if (delta > 0) {
      addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player.ID,
        delta,
      }]);
    }
  }
}

function ElementalRefresh(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    for (const enemy of player.Enemies) {
      const elements = [...enemy.Elements];
      enemy.clearElements();
      for (const element of elements) {
        addToSteps([{
          type: EDetailedStep.EnemyLoseElement,
          enemyId: enemy.ID,
          element: element.Name,
        }]);
      }
    }
  }
}

function SlowingWater(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    const discarded = player.discardRandomCard();
    if (discarded) {
      addToSteps([{
        type: EDetailedStep.MoveCard,
        to: "discard",
        playerId: player.ID,
        card: discarded.getPrimitive(),
      }]);
    }
    for (const enemy of player.Enemies) {
      if (enemy.Elements.length === 0) {
        enemy.applyElement(new Hydro(), player);
        addToSteps([{
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Hydro,
        }]);
      }
    }
  }
}

function ChaosCluster(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    if (player.Energy >= 5) {
      const shieldBefore = player.Shields;
      player.applyDamage(2, false);
      const shieldDelta = player.Shields - shieldBefore;
      if (shieldDelta < 0) {
        addToSteps([{
          type: EDetailedStep.PlayerStatChange,
          stat: "shield",
          playerId: player.ID,
          delta: shieldDelta,
        }]);
      }
      const hpDamage = Math.max(0, 2 - shieldBefore);
      if (hpDamage > 0) {
        addToSteps([{
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.ID,
          damage: hpDamage,
          isPiercing: false,
        }]);
      }
    }
  }
}

function HighEnergyCores(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    if (player.Energy >= 5) {
      player.addHealth(1);
      addToSteps([{
        type: EDetailedStep.PlayerHeal,
        playerId: player.ID,
        amount: 1,
      }]);
    }
  }
}

function IcicleBlast(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    const allFreeze = [
      ...player.Hand.filter((card) => card.Name === ECard.Freeze),
      ...player.Discard.filter((card) => card.Name === ECard.Freeze),
    ];
    for (const card of allFreeze) {
      player.trashCardById(card.ID);
    }
    const damage = allFreeze.length;
    if (damage > 0) {
      player.applyDamage(damage, true);
      addToSteps([{
        type: EDetailedStep.PlayerTakeDamage,
        playerId: player.ID,
        damage,
        isPiercing: true,
      }]);
    }
  }
}

function PlasmaField(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    if (player.Energy === 0) {
      const energyBefore = player.Energy;
      player.addEnergy(3);
      const delta = player.Energy - energyBefore;
      if (delta > 0) {
        addToSteps([{
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: player.ID,
          delta,
        }]);
      }
    }
  }
}

function EnergyTides(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    const energyBefore = player.Energy;
    if (player.Energy >= 5) {
      player.addEnergy(-2);
    } else {
      player.addEnergy(2);
    }
    const delta = player.Energy - energyBefore;
    if (delta !== 0) {
      addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.ID,
        delta,
      }]);
    }
  }
}

function WindCurrent(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    if (player.Health <= 7) {
      const dash = new Dash();
      player.addCardToHand(dash);
      addToSteps([{
        type: EDetailedStep.MoveCard,
        to: "hand",
        playerId: player.ID,
        card: dash.getPrimitive(),
      }]);
    }
  }
}

function SheerCold(players: Player[], addToSteps: (steps: DetailedStep[]) => void) {
  for (const player of players) {
    if (!player.Hand.some((card) => card.Name === ECard.Freeze)) {
      const freeze = new Freeze();
      player.addCardToDeck(freeze);
      freeze.revealDeckPositionToClient = true;
      addToSteps([{
        type: EDetailedStep.MoveCard,
        to: "deck",
        playerId: player.ID,
        card: freeze.getPrimitive(),
      }]);
    }
  }
}

export const DvalinLeylines: LeylineEntry[] = [
  { use: EngulfingStorm, name: ELeyline.EngulfingStorm },
  { use: SmolderingFlames, name: ELeyline.SmolderingFlames },
  { use: MonsterAttendants, name: ELeyline.MonsterAttendants },
  { use: Adrenaline, name: ELeyline.Adrenaline },
  { use: CondensedIce, name: ELeyline.CondensedIce },
  { use: LightingBolts, name: ELeyline.LightingBolts },
  { use: ReinforcedShields, name: ELeyline.ReinforcedShields },
  { use: ElementalRefresh, name: ELeyline.ElementalRefresh },
  { use: SlowingWater, name: ELeyline.SlowingWater },
  { use: ChaosCluster, name: ELeyline.ChaosCluster },
  { use: HighEnergyCores, name: ELeyline.HighEnergyCores },
  { use: IcicleBlast, name: ELeyline.IcicleBlast },
  { use: PlasmaField, name: ELeyline.PlasmaField },
  { use: EnergyTides, name: ELeyline.EnergyTides },
  { use: WindCurrent, name: ELeyline.WindCurrent },
  { use: SheerCold, name: ELeyline.SheerCold },
];
