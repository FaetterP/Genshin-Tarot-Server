# Genshin Tarot Server — правила для Claude Code

## Тесты карт (`tests/cards/`)

### Философия тестирования

Тесты **имитируют поведение пользователя на UI**, а не проверяют отдельные функции.
Каждый тест — это последовательность WS-запросов и проверка того, что все игроки получили правильные события для корректной отрисовки интерфейса.

Конкретно: тест запускает **реальный WS-сервер** (порты 19999/19998), подключается к нему через `GameTestClient` и `AdminTestClient`, настраивает состояние через Admin API, отправляет игровые запросы и проверяет пришедшие события.

---

### Инфраструктура

**Не использовать** Jest-моки для игровой логики, рандомизации врагов или эффектов.
Вместо этого — настраивать состояние через `admin.updateEnemy / updatePlayer / moveCard` после старта игры.

```
tests/
  helpers/
    setup.ts        — вся инфраструктура: GameTestClient, AdminTestClient, createTestGame, ensureCardInHand
  cards/
    ForeignRockblade.test.ts
    ...
```

**Жизненный цикл серверов:**
```ts
beforeAll(async () => { await startTestServers(); });
afterAll(async () => { await stopTestServers(); });
beforeEach(() => { resetGame(); });            // сбрасывает CycleController и TaskAwaiter
afterEach(() => { game?.cleanup(); });          // закрывает все WS-соединения
```

`jest.setTimeout(15000)` в каждом файле тестов — WS-тесты медленнее юнит-тестов.

---

### Структура файла теста

Каждый тест-файл начинается с JSDoc-комментария с описанием карты:

```ts
/**
 * НазваниеКарты - что делает карта (эффект, цель).
 * Тип: Attack / Skill / Other. Стоимость: N
 */
```

`describe` повторяет это описание: `"НазваниеКарты - что делает карта"`.

---

### Перед написанием тестов

Прочитай реализацию карты (`src/storage/cards/...`) и выпиши все входные параметры из `CardUseContext`:
- `enemies` — передаётся? обязательно? сколько используется?
- `isUseAlternative` — есть ли альтернативный режим?
- `selectedPlayer`, `selectedCard` — используются?

Для каждой атаки зафиксируй:
- `isPiercing` — пронзающая? (пронзает щиты)
- `isRange` — дальняя? (можно бить врага в другой зоне)

Для параметров с **неочевидным поведением** (например: что даёт `isUseAlternative` если у карты нет явной ветки, что происходит при 0 HP у врага) — **спроси пользователя** перед написанием тестов. Не придумывай логику самостоятельно.

Убедись, что карта возвращает все DetailedStep, которые нужны для корректного отображения состяония на UI. Если в реализации чего-то не хватает или ты считаешь, что поведение неправильное, то спроси, что делать в таком случае. 

---

### Инициализация состояния

`createTestGame(numPlayers?)` запускает игру, добавляет 4 персонажа каждому игроку (Aether, Amber, Diluc, Bennett) и возвращает `{ players, admin, cleanup }`. После этого:

1. Поставить нужного врага в конкретное состояние:
   ```ts
   await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0 });
   ```
2. Гарантировать карту в руке:
   ```ts
   const cardId = await ensureCardInHand(player, admin, ECard.ForeignRockblade);
   ```
3. Опционально — изменить ресурсы игрока:
   ```ts
   await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });
   ```

**Никогда не полагаться на дефолтные значения** — HP врага, AP игрока, наличие карты в руке. Всё устанавливать явно.

Тесты держать в **первых двух циклах** (cycle 1–2): leylines появляются с третьего цикла и могут непредсказуемо менять состояние.

#### Элементы врагов

Многие враги переопределяют `reveal()` и стартуют с элементом: `SmallAnemoSlime`, `SmallCryoSlime`, `SmallGeoSlime`, `SmallElectroSlime`, `SmallHydroSlime`, `SmallPyroSlime`. Если тест зависит от наложения элементов или реакций, **всегда сбрасывай элементы** при инициализации:

```ts
await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
```

Иначе случайный элемент-слайм из волны вызовет неожиданную реакцию уже в первом цикле и сломает тест во втором.

#### Добавление дополнительного врага

Используй `admin.addEnemy`, затем жди `admin.stateSync` с нужным количеством врагов (это событие рассылается всем игровым клиентам после каждого admin-действия):

```ts
await admin.addEnemy(player.playerId, EEnemy.SmallDendroSlime);
const syncMsg = await player.waitFor(
  (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
);
const enemies: { id: string }[] = syncMsg.you.enemies;
// после этого — updateEnemy с elements: [] для каждого
```

`HilichurlGuard` — безопасный выбор: нет стартового элемента, нет способностей.

#### Добавление карты в руку или сброс

Для карты **в руку** — жди `admin.stateSync` с нужной картой:

```ts
await admin.addCard(player.playerId, ECard.ForeignRockblade, "hand");
const syncMsg = await player.waitFor(
  (m: any) => m.action === "admin.stateSync" &&
    m.you.hand.some((c: any) => c.name === ECard.ForeignRockblade),
);
const cardId: string = syncMsg.you.hand.find(
  (c: any) => c.name === ECard.ForeignRockblade,
).cardId;
```

Для карты **в сброс** — `admin.stateSync` не содержит сброс, поэтому читай из `admin.state` (которое приходит в admin-буфер после каждого admin-действия):

```ts
await admin.addCard(player.playerId, ECard.ForeignRockblade, "discard");
const adminState = await admin.waitFor((m: any) => m.action === "admin.state");
const playerState = adminState.players.find((p: any) => p.playerId === player.playerId);
const cardId: string = playerState.discard.find(
  (c: any) => c.name === ECard.ForeignRockblade,
).cardId;
```

---

### Приём событий

`GameTestClient.waitFor(predicate)` — предикатная подписка с буфером. Сообщения, пришедшие до вызова `waitFor`, сохраняются в буфере и немедленно возвращаются при совпадении предиката. Это устойчиво к порядку прихода событий.

`GameTestClient` **автоматически** отвечает на любое сообщение с `taskId` (используется в `sendToAllAndWait` для `game.startGame` и `game.endCycle`). Тесты не должны обрабатывать это вручную.

Типовой паттерн ожидания ответа:
```ts
player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
const response = await player.waitFor((m: any) => m.action === "game.useCard");
```

Для ошибки:
```ts
player.send({ action: "game.useCard", cardId });
const response = await player.waitFor((m: any) => m.status !== undefined);
expect(response.status).toBe("error");
```

---

### Многоходовые тесты (multi-turn)

Если карта накладывает эффект, который срабатывает в следующем цикле, тест завершает ход и проверяет шаги из события `game.startCycle`.

#### Как работает переход цикла

`endTurn(player)` отправляет `game.endTurn` и ждёт `game.startCycle`. Возвращает объект цикла с полями:
- `cycle.steps` — все шаги, сгенерированные в начале цикла (сброс щита, начисление AP, раздача карт, **срабатывание эффектов игрока**, начало хода врагов)
- `cycle.you` — состояние игрока на начало цикла (после всех шагов)

Эффекты игрока срабатывают **внутри** `cycleStartHandler`, поэтому их шаги попадают в `cycle.steps` — это то место, где нужно искать реакции, нанесение элементов и снятие эффектов.

#### Паттерн одиночного игрока

```ts
// Цикл 1: используем карту
player.send({ action: "game.useCard", cardId });
await player.waitFor((m: any) => m.action === "game.useCard");

// Завершаем ход — получаем данные цикла 2
const cycle2 = await endTurn(player);

// Проверяем шаги из начала цикла 2
expect(cycle2.steps).toContainEqual(
  expect.objectContaining({
    type: EDetailedStep.EnemyReaction,
    enemyId: enemy.id,
    element1: EElement.Geo,
    element2: EElement.Geo,
  }),
);

// Итоговое состояние — из cycle2.you, а не response.player предыдущего действия
expect(cycle2.you.effects).not.toContain(EPlayerEffect.SolarIsotoma);
```

#### Паттерн нескольких игроков

```ts
// Перейти к следующему циклу (заканчивает ходы всех игроков и ждёт game.startCycle)
const [cycle2p1, cycle2p2] = await advanceCycle([player1, player2]);
```

`advanceCycle` отправляет `game.endTurn` от каждого игрока и ждёт `game.startCycle` для каждого.

#### Что проверять в многоходовых тестах

Шаги из **использования карты** — в `response.steps` (ответ на `game.useCard`).  
Шаги из **следующего цикла** — в `cycle2.steps` (ответ на `game.startCycle`).

Типичные шаги для эффекта, срабатывающего в начале цикла:
- `PlayerEffectTrigger { playerId, effect, isRemove: true }` — эффект сработал и снимается
- `PlayerLoseEffect { playerId, effect }` — эффект удалён с игрока
- `EnemyGetElement` или `EnemyReaction` — в зависимости от того, был ли элемент уже на враге

#### Как `applyElement` генерирует шаги в `onStartCycle`

Некоторые эффекты (например `SolarIsotomaEffect`, `DominusLapidisEffect`) в `onStartCycle` только вызывают `enemy.applyElement(...)` — без явного `player.addSteps`. В этом случае:

- Если у врага **уже есть элемент** (от использования карты в цикле 1) → `applyElement` автоматически генерирует шаг `EnemyReaction`, который попадает в `cycle2.steps`.
- Если враг **без элемента** — шаг не генерируется (эффект применяется молча).

**Паттерн теста** для таких эффектов:
1. Явно сбрось элементы врага: `await admin.updateEnemy(enemy.id, { elements: [] })`
2. Используй карту в цикле 1 (она применяет элемент через `applyElement` / `applyAttack`) — в `response.steps` будет `EnemyGetElement`
3. Вызови `endTurn` — в `cycle2.steps` будет `EnemyReaction` (реакция того же элемента с собой)

```ts
// cycle 1
await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
player.send({ action: "game.useCard", cardId });
await player.waitFor((m: any) => m.action === "game.useCard");

// cycle 2
const cycle2 = await endTurn(player);
expect(cycle2.steps).toContainEqual(
  expect.objectContaining({
    type: EDetailedStep.EnemyReaction,
    enemyId: enemy.id,
    element1: EElement.Geo,
    element2: EElement.Geo,
  }),
);
```

`waitFor` устойчив к порядку прихода событий: `game.endCycle`, `game.startCycle`, `game.endTurn` от другого игрока — всё буферизуется и доступно по предикату в любой момент.

Между ходами не проверять внутреннее состояние объектов напрямую — только через WS-события. После `endTurn` состояние игрока читать из `cycle.you`, а не из `response.player` предыдущего действия.

---

### Что проверять в каждом тест-кейсе

**Наличие и содержимое шагов** в `response.steps` — через `toContainEqual + objectContaining`:
```ts
expect(response.steps).toContainEqual(
  expect.objectContaining({
    type: EDetailedStep.EnemyTakeDamage,
    enemyId: enemy.id,
    damage: 3,
    isPiercing: false,
  }),
);
```

**Порядок шагов**, если он важен для анимации (например, урон до смерти):
```ts
const damageIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyTakeDamage);
const deathIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyDeath);
expect(damageIdx).toBeLessThan(deathIdx);
```

**Итоговое состояние** — из `response.player`, а не из внутренних объектов сервера:
```ts
expect(response.player.enemies[0].hp).toBe(7);
expect(response.player.actionPoints.total).toBe(2);
expect(response.player.shields).toBe(3);
```

**Стандартные шаги** проверяются в каждом тест-кейсе, не только в первом:
- `PlayerStatChange { stat: "actionPoints", delta: -N }` — списание AP
- `MoveCard { to: "discard", card: { name: ECard.X } }` — карта ушла в сброс

---

### Покрытие сценариев

Для каждой карты:

- **Основной сценарий** — карта сработала, враг выжил
- **Враг погибает** — шаги `EnemyDeath`, враг исчез из `response.player.enemies`, появилась новая волна (`EnemyAppearance`)
- **Щит блокирует урон** — если `isPiercing: false`: оба шага `EnemyTakeDamage` + `EnemyBlockDamage` присутствуют, HP врага не изменился. Это **ожидаемое поведение**, не баг — UI показывает анимацию удара и блока
- **`isUseAlternative: true`** — если карта имеет альтернативный режим
- **Несколько врагов** — проверить, что карта бьёт правильного
- **Отсутствие обязательных полей** — `{ status: "error" }` с понятным сообщением
- **Недостаточно AP** — `{ status: "error", message: "not enough action points..." }`
- **Второй игрок получает событие** — отдельный тест с `createTestGame(2)`, проверяем что оба получили `game.useCard` с одинаковым `card` и `player.playerId` равным player1

---

### Щиты и пронзающий урон

- `isPiercing: false` → нормальная атака. Если у врага `shield > 0`, урон заблокирован. В `steps` будут **оба** шага: `EnemyTakeDamage` (намерение карты) и `EnemyBlockDamage` (результат applyAttack). HP врага не изменится.
- `isPiercing: true` → пробивает щиты. `EnemyBlockDamage` не будет. HP уменьшается всегда.
- `isRange: true` → карта может бить врагов в зоне другого игрока.

---

### Чего не делать

- Не мокировать `getRandomElement`, рандом врагов, leylines — вместо этого настраивать конкретное состояние через Admin API после старта игры.
- Не проверять шаги, которые карта заведомо не генерирует в данном сценарии.
- Не читать внутреннее состояние объектов сервера напрямую (`enemy.Health`, `player.Shields`) — только через WS-ответы.
- Не полагаться на то, что карта окажется в руке после `createTestGame` — всегда использовать `ensureCardInHand`.
- Не писать тесты для циклов 3+ без явного указания пользователя — leylines добавляют непредсказуемость.
- Не придумывать edge cases самостоятельно — спрашивать пользователя о неочевидном поведении.
