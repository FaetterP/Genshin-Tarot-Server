# Genshin-Tarot-Server

Серверная часть игры _Genshin Tarot_.

## Установка

Для запуска приложения требуется установить nodejs.  
Текущая версия nodejs `v16.16.0`.  
Версия npm `8.11.0`.

Для установки всех пакетов нужно перейти в папку с проектом и написать `npm i`.

## Запуск

`npm run build` - начать сборку приложения.  
`npm run start` - запускает уже собранное приложение.  
`npm run dev` - запуск в режиме разработки.

По умолчанию сервер поднимает вебсокет на порте `8006`. Это можно изменить в конфиге.

## Команды для wss

Для общения с сервером используется websocket сервер. Это значит, что клиент может не только отправлять запросы, но и в любой момент времени получить запрос к себе. Поэтому ниже будут расписаны команды, которые клиент может отправить, и которые может получить.

- Игрок добавляет себе в команду персонажа.

```json
{
  "action": "characters.addCharacter",
  "character": "Aether"
}
```

- Игрок убирает персонажа из своей команды

```json
{
  "action": "characters.removeCharacter",
  "character": "Aether"
}
```

- Запуск игры

```json
{
  "action": "game.startGame"
}
```

- Игрок использует атакующую карту на враге

```json
{
  "action": "game.attackCard",
  "enemyId": "enemy-{uuid}",
  "cardId": "card-{uuid}"
}
```

- Игрок использует скилл

```json
{
  "action": "game.useCard",
  "cardId": "card-{uuid}"
}
```

- Игрок завершает ход

```json
{
  "action": "game.endTurn"
}
```

- Клиент завершил выполнение задачи

```json
{
  "action": "task.completeTask",
  "taskId": "task-{uuid}"
}
```

## Ответы от wss

- Игрок добавил себе персонажа

```json
{
  "action": "characters.addCharacter",
  "player": "player-{uuid}",
  "character": "Aether"
}
```

- Игрок удалил у себя персонажа

```json
{
  "action": "characters.removeCharacter",
  "player": "player-{uuid}",
  "character": "Aether"
}
```

- Игра началась

```json
{
  "action": "game.startGame"
}
```

- Начало цикла

```json
{
  "action": "game.startCycle",
  "cycle": 1,
  "players": [
    {
      "playerId": "player-{uuid}",
      "hp": 10,
      "wave": 1,
      "enemies": [
        {
          "id": "enemy-{uuid}",
          "name": "SmallCryoSlime",
          "hp": 5,
          "shield": 0,
          "elements": ["Cryo"]
        }
      ]
    }
  ]
}
```

- Игрок завершил ход

```json
{
  "action": "game.endTurn",
  "player": "player-{uuid}"
}
```

- Игрок атаковал врага

```json
{
  "action": "game.attackCard",
  "player": {
    "playerId": "player-{uuid}",
    "hp": 10,
    "wave": 1,
    "enemies": [
      {
        "id": "enemy-{uuid}",
        "name": "SmallCryoSlime",
        "hp": 5,
        "shield": 0,
        "elements": ["Cryo"]
      }
    ]
  },
  "card": "card-{uuid}",
  "enemy": {
    "id": "enemy-{uuid}",
    "name": "SmallCryoSlime",
    "hp": 5,
    "shield": 0,
    "elements": ["Cryo"]
  }
}
```

- Игрок использовал скилл

```json
{
  "action": "game.useCard",
  "cardId": "card-{uuid}",
  "player": {
    "playerId": "player-{uuid}",
    "hp": 10,
    "wave": 1,
    "enemies": [
      {
        "id": "enemy-{uuid}",
        "name": "SmallCryoSlime",
        "hp": 5,
        "shield": 0,
        "elements": ["Cryo"]
      }
    ]
  }
}
```
