import { v4 } from "uuid";
import {
  CycleEndContext,
  CycleStartContext,
  EnemyDeathContext,
  EnemyEndCycleContext,
  PlayerEndsWavesContext,
} from "../../types/eventsContext";
import { Card } from "../storage/cards/Card";
import { Character } from "../storage/characters/Character";
import { Enemy } from "../storage/enemies/Enemy";
import { Event } from "../utils/Event";
import { clamp } from "../utils/math";
import { EnemyPrimitive, PlayerPrimitive } from "../../types/general";
import { Freeze } from "../storage/cards/misc/Freeze";
import { PlayerEffect } from "../storage/effects/PlayerEffect";
import { getRandomElement } from "../utils/arrays";
import { eliteEnemies, normalEnemies } from "../storage/enemies";
import { CycleController } from "./CycleController";

export class Player {
  public readonly ID: string;
  private hp: number = 0;
  private energy: number = 0;
  private shield: number = 0;
  private mora: number = 0;

  private enemies: Enemy[] = [];
  private wave: number = 0;
  private actionPoints: number = 0;
  private extraActionPoints: number = 0;
  private isTurnEnds: boolean = true;

  private hand: Card[] = [];
  private discard: Card[] = [];
  private deck: Card[] = [];
  private lastCard?: Card;

  private characters: Character[] = [];
  private effects: PlayerEffect[] = [];

  private e_onWavesDefeated = new Event<PlayerEndsWavesContext>();

  public get Health() {
    return this.hp;
  }
  public get Energy() {
    return this.energy;
  }
  public get Shields() {
    return this.shield;
  }
  public get Wave() {
    return this.wave;
  }
  public get Enemies(): ReadonlyArray<Enemy> {
    return this.enemies;
  }
  public get ActionPoints() {
    return {
      actionPoints: this.actionPoints,
      extraActionPoints: this.extraActionPoints,
      total: this.actionPoints + this.extraActionPoints,
    };
  }
  public get Characters(): ReadonlyArray<Character> {
    return this.characters;
  }
  public get Hand(): ReadonlyArray<Card> {
    return this.hand;
  }
  public get LastCard(): Card | undefined {
    return this.lastCard;
  }
  public get IsTurnEnds() {
    return this.isTurnEnds;
  }

  constructor(cycleController: CycleController) {
    this.ID = `player-${v4()}`;

    cycleController.OnCycleEnd.addListener(this.cycleEndHandler.bind(this));
    cycleController.OnCycleStart.addListener(this.cycleStartHandler.bind(this));
  }

  public getPrimitiveStats(): PlayerPrimitive {
    const enemies: EnemyPrimitive[] = [];
    for (const enemy of this.enemies) {
      enemies.push(enemy.getPrimitiveStats());
    }

    const effects: string[] = [];
    for (const effect of this.effects) {
      effects.push(effect.Name);
    }

    return {
      playerId: this.ID,
      hp: this.hp,
      shields: this.shield,
      energy: this.energy,
      wave: this.wave,
      mora: this.mora,
      actionPoints: {
        normal: this.actionPoints,
        extra: this.extraActionPoints,
        total: this.actionPoints + this.extraActionPoints,
      },
      enemies,
      effects,
      characters: this.characters.map((character) => character.Name),
      hand: this.hand.map((card) => ({ cardId: card.ID, name: card.Name })),
      discard: this.discard.map((card) => ({
        cardId: card.ID,
        name: card.Name,
      })),
      deck: this.deck.map((card) => ({ cardId: card.ID, name: card.Name })),
    };
  }

  public addCharacter(character: Character) {
    if (this.characters.map((item) => item.Name).includes(character.Name)) {
      throw new Error("duplicate character");
    }

    if (this.characters.length >= 4) {
      throw new Error("maximum characters");
    }

    this.characters.push(character);
  }

  public removeCharacter(character: Character) {
    if (!this.characters.map((item) => item.Name).includes(character.Name)) {
      throw new Error("no have character");
    }

    this.characters = this.characters.filter(
      (item) => item.Name !== character.Name
    );
  }

  public startGame() {
    for (const character of this.characters) {
      this.deck.push(...character.Cards);
    }

    this.hp = 12;
    this.shield = 0;
    this.energy = 0;
  }

  public applyDamage(damage: number, isPiercing: boolean = false) {
    if (isPiercing) {
      this.hp -= damage;
    } else {
      this.shield -= damage;
      if (this.shield < 0) {
        this.hp += this.shield;
        this.shield = 0;
      }
    }

    if (this.hp <= 0) {
      // TODO
    }
  }

  public addEffect(effect: PlayerEffect) {
    this.effects.push(effect);
  }

  public isContainsEffect(effect: PlayerEffect) {
    return this.effects.map((effect) => effect.Name).includes(effect.Name);
  }

  public addEnergy(count: number) {
    if (this.hand.map((card) => card.Name).includes(new Freeze().Name)) {
      return;
    }

    this.energy = clamp(this.energy + count, 0, 12);
  }

  public trySpendEnergy(count: number): boolean {
    if (this.energy < count) {
      return false;
    }

    if (this.hand.map((card) => card.Name).includes(new Freeze().Name)) {
      return false;
    }

    this.energy -= count;
    return true;
  }

  public trySpendActonPoints(count: number): boolean {
    if (this.ActionPoints.total < count) return false;

    this.extraActionPoints -= count;

    if (this.extraActionPoints > 0) return true;

    this.actionPoints += this.extraActionPoints;
    this.extraActionPoints = 0;

    return true;
  }

  public addHealth(count: number) {
    if (count < 0) {
      throw new Error("to do damage use applyAttack");
    }

    this.hp = clamp(this.hp + count, 0, 12);
  }

  public addShield(count: number) {
    this.shield = clamp(this.shield + count, 0, 12);
  }

  public addExtraActionPoints(count: number) {
    this.extraActionPoints = clamp(this.extraActionPoints + count, 0, 3);
  }
  public addActionPoints(count: number) {
    this.actionPoints = clamp(this.actionPoints + count, 0, 3);
  }

  public createWave() {
    if (this.wave >= 5) {
      this.e_onWavesDefeated.Invoke({ player: this });
      return;
    }

    if (this.enemies.length > 0) {
      return;
    }

    this.enemies = [];
    const count = [1, 2, 3, 2, 3][this.wave];
    const isElite = this.wave === 4;

    for (let i = 0; i < count; i++) {
      const enemyType = getRandomElement(
        isElite ? eliteEnemies : normalEnemies
      );
      const addedEnemy: Enemy = new enemyType();
      addedEnemy.OnDeath.addListener(this.enemyDeathHandler.bind(this));
      addedEnemy.OnEndCycle.addListener(this.enemyEndCycleHandler.bind(this));
      this.enemies.push(addedEnemy);
    }

    for (const enemy of this.enemies) {
      enemy.reveal();
    }

    this.wave++;
  }

  public drawCard(): Card {
    if (this.deck.length === 0) {
      this.restoreDeck();
    }

    const card = getRandomElement(this.deck);
    this.deck = this.deck.filter((c) => c != card);
    this.hand.push(card);
    return card;
  }

  private restoreDeck() {
    const count = this.discard.length;
    for (let i = 0; i < count; i++) {
      const card = this.discard[0];
      this.deck.push(card);
      this.discard = this.discard.filter((c) => c !== card);
    }
  }

  public discardCard(card: Card) {
    this.hand = this.hand.filter((c) => c != card);
    this.discard.push(card);
  }

  public discardRandomCard() {
    if (this.hand.length === 0) return;

    const card = getRandomElement(this.hand);
    this.hand = this.hand.filter((c) => c != card);
    this.discard.push(card);
  }

  public addCardToDiscard(card: Card) {
    this.discard.push(card);
  }

  public addCardToHand(card: Card) {
    this.hand.push(card);
  }

  public addCardToDeck(card: Card) {
    this.deck.push(card);
  }

  public useAttackEffects(enemy: Enemy) {
    for (const effect of this.effects) {
      if (effect.onAttack(this, enemy)) {
        this.effects = this.effects.filter((eff) => eff !== effect);
      }
    }
  }

  public endTurn() {
    this.isTurnEnds = true;
  }

  /* Subscribes */

  private enemyDeathHandler({ enemy }: EnemyDeathContext) {
    this.mora += enemy.Mora;
    this.enemies = this.enemies.filter((item) => item !== enemy);

    if (this.enemies.length === 0) {
      this.createWave();
    }
  }

  private enemyEndCycleHandler(ctx: EnemyEndCycleContext) {
    this.applyDamage(ctx.enemy.Damage);
    ctx.addToReport([
      {
        type: "enemyAttack",
        player: this.ID,
        enemy: ctx.enemy.ID,
        damage: ctx.enemy.Damage,
      },
    ]);
  }

  private cycleStartHandler(ctx: CycleStartContext) {
    if (this.enemies.length === 0) {
      this.createWave();
      ctx.addToReport([
        {
          type: "createWave",
          player: this.ID,
          enemies: this.enemies.map((enemy) => enemy.getPrimitiveStats()),
        },
      ]);
    }

    this.isTurnEnds = false;

    this.shield = 0;
    this.actionPoints = 3;
    this.extraActionPoints = 0;
    ctx.addToReport([{ type: "resetStats", player: this.ID }]);

    for (let i = 0; i < 5; i++) {
      this.drawCard();
    }
    ctx.addToReport([
      {
        player: this.ID,
        type: "drawCards",
        cards: this.hand.map((card) => ({ name: card.Name, cardId: card.ID })),
      },
    ]);

    for (const effect of this.effects) {
      const isRemove = effect.onStartCycle(this);
      if (isRemove) {
        this.effects = this.effects.filter((eff) => eff !== effect);
      }

      ctx.addToReport([
        { type: "useEffect", effect: effect.Name, isRemove, player: this.ID },
      ]);
    }

    for (const enemy of this.enemies) {
      enemy.startCycle();
    }
  }

  private cycleEndHandler(ctx: CycleEndContext) {
    const count = this.hand.length;
    for (let i = 0; i < count; i++) {
      this.discardRandomCard();
    }
    ctx.addToReport([{ type: "clearHand", player: this.ID }]);

    for (const enemy of this.enemies) {
      enemy.endCycle(ctx.addToReport);
    }
  }
}
