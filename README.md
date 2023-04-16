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

- Игрок использует карту

```json
{
  "action": "game.useCard",
  "cardId": "card-{uuid}",
  "selectedPlayer": "player-{uuid}",
  "enemies": ["enemy-{uuid}"],
  "selectedPlayer": "player-{uuid}",
  "isUseAlternative": true
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
  "action": "game.startGame",
  "taskId": "task-{uuid}"
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
      "shields": 10,
      "energy": 10,
      "actionPoints": {
        "normal": 3,
        "extra": 1,
        "total": 4
      },
      "wave": 1,
      "characters": ["Amber"],
      "hand": ["Sharpshooter"],
      "enemies": [
        {
          "id": "enemy-{uuid}",
          "name": "SmallCryoSlime",
          "hp": 5,
          "shield": 0,
          "elements": ["Cryo"],
          "isStunned": false
        }
      ],
      "effects": ["SolarIsotoma"]
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
    "shields": 10,
    "energy": 10,
    "actionPoints": {
      "normal": 3,
      "extra": 1,
      "total": 4
    },
    "wave": 1,
    "characters": ["Amber"],
    "hand": ["Sharpshooter"],
    "enemies": [
      {
        "id": "enemy-{uuid}",
        "name": "SmallCryoSlime",
        "hp": 5,
        "shield": 0,
        "elements": ["Cryo"],
        "isStunned": false
      }
    ]
  },
  "card": "card-{uuid}",
  "enemy": {
    "id": "enemy-{uuid}",
    "name": "SmallCryoSlime",
    "hp": 5,
    "shield": 0,
    "elements": ["Cryo"],
    "isStunned": false
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
    "shields": 10,
    "energy": 10,
    "actionPoints": {
      "normal": 3,
      "extra": 1,
      "total": 4
    },
    "wave": 1,
    "characters": ["Amber"],
    "hand": ["Sharpshooter"],
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

## Списки

Персонажи:  
`Aether, Albedo, Amber, Barbara, Beidou, Bennett, ChongYun, Diluc, Diona, Eula, Fischl, Ganyu, HuTao, Jean, Kaeya, Kazuha, KeQing, Klee, Lisa, Lumine, Mona, NingGuang, Noelle, QiQi, Raiden, Razor, Rosaria, Sucrose, Tartaglia, Venti, XiangLing, Xiao, XingQiu, Xinyan, Yanfei, Yoimiya, ZhongLi`

Карты:  
`ForeignRockblade, ForeignRockbladePlus, StarfellSword, StarfellSwordPlus`,  
`WeissBladework, WeissBladeworkPlus, SolarIsotoma, SolarIsotomaPlus`,  
`Sharpshooter, SharpshooterPlus, ExplosivePuppet, ExplosivePuppetPlus`,  
`WhisperOfWater, WhisperOfWaterPlus, LetTheShowBegin, LetTheShowBeginPlus`,  
`Oceanborn, OceanbornPlus, Tidecaller, TidecallerPlus`,  
`StrikeOfFortune, StrikeOfFortunePlus, PassionOverload, PassionOverloadPlus`,  
`Demonbane, DemonbanePlus, LayeredFrost, LayeredFrostPlus`,  
`TemperedSword, TemperedSwordPlus, SearingOnslaught, SearingOnslaughtPlus`,  
`KatzleinStyle, KatzleinStylePlus, IcyPaws, IcyPawsPlus`,  
`EdelBladework, EdelBladeworkPlus, IcetideVortex, IcetideVortexPlus`,  
`BoltsOfDownfall, BoltsOfDownfallPlus, Nightrider, NightriderPlus`,  
`LiutianArchery, LiutianArcheryPlus, TrailOfTheQilin, TrailOfTheQilinPlus`,  
`SpearOfWangsheng, SpearOfWangshengPlus, GuideOfAfterlife, GuideOfAfterlifePlus`,  
`FavoniusBladework, FavoniusBladeworkPlus, GaleBlade, GaleBladePlus`,  
`CeremonialBladework, CeremonialBladeworkPlus, Frostgnaw, FrostgnawPlus`,  
`GaryuuBladework, GaryuuBladeworkPlus, Chihayaburu, ChihayaburuPlus`,  
`YunlaiSwordsmanship, YunlaiSwordsmanshipPlus, StellarRestoration, StellarRestorationPlus`,  
`Kaboom, KaboomPlus, JumpyDumpty, JumpyDumptyPlus`,  
`LightningTouch, LightningTouchPlus, VioletArc, VioletArcPlus`,  
`ForeignIronwind, ForeignIronwindPlus, PalmVortex, PalmVortexPlus`,  
`RippleOfFate, RippleOfFatePlus, MirrorReflections, MirrorReflectionsPlus`,  
`SparklingScatter, SparklingScatterPlus, JadeScreen, JadeScreenPlus`,  
`MaidsBladework, MaidsBladeworkPlus, Breastplate, BreastplatePlus`,  
`AncientSwordArt, AncientSwordArtPlus, HeraldOfFrost, HeraldOfFrostPlus`,  
`Origin, OriginPlus, BalefulOmen, BalefulOmenPlus`,  
`SteelFang, SteelFangPlus, ClawAndThunder, ClawAndThunderPlus`,  
`SpearOfTheChurch, SpearOfTheChurchPlus, RavagingConfession, RavagingConfessionPlus`,  
`WindSpiritCreation, WindSpiritCreationPlus, AnemoHypostatis, AnemoHypostatisPlus`,  
`CuttingTorrent, CuttingTorrentPlus, RagingTide, RagingTidePlus`,  
`DivineArchery, DivineArcheryPlus, SkywardSonnet, SkywardSonnetPlus`,  
`DoughFu, DoughFuPlus, GuobaFire, GuobaFirePlus`,  
`WhirlwindThrust, WhirlwindThrustPlus, LemniscaticWind, LemniscaticWindPlus`,  
`GuhuaStyle, GuhuaStylePlus, FatalRainscreen, FatalRainscreenPlus`,  
`DanceOfFire, DanceOfFirePlus, SweepingFervor, SweepingFervorPlus`,  
`SealOfApproval, SealOfApprovalPlus, SignedEdict, SignedEdictPlus`,  
`FireworkFlareUp, FireworkFlareUpPlus, NiwabiFireDance, NiwabiFireDancePlus`,  
`RainOfStone, RainOfStonePlus, DominusLapidis, DominusLapidisPlus`

Эффекты на игроке:  
`Breastplate, DominusLapidis, ExplosivePuppet, GuideOfAfterlife, GuobaFire, LayeredFrost, LetTheShowBegin, MirrorReflections, Nightrider, NightriderPlus, NiwabiFireDance, Pyronado, Raincutter, SkywardSonnet, SkywardSonnetPlus, SolarIsotoma, Stormbreaker, TrailOfTheQilin`

Враги:  
`SmallAnemoSlime, SmallCryoSlime, SmallDendroSlime, SmallElectroSlime, SmallGeoSlime, SmallHydroSlime, SmallPyroSlime`,  
`GiantAnemoSlime, GiantCryoSlime, GiantDendroSlime, GiantElectroSlime, GiantGeoSlime, GiantHydroSlime, GiantCryoSlime`,  
`HilichurlGang, HilichurlGuard, HilichurlGrenadier, HilichurlBerserk, CryoHilichurlShooter, ElectroHilichurlShooter, PyroHilichurlShooter`,  
`AnemoShamachurl, DendroShamachurl, GeoShamachurl, UnusualHilichurl, CryoAbyssMage, HydroAbyssMage, PyroAbyssMage`,
`AnemoBoxer, CryoGunner, ElectroHammer, GeoChanter, HydroGunner, PyroSlinger`,  
`TreasureHoarderGang, VishapHatchling, CryoCicinSwarm, ElectroCicinSwarm, CryoWhopperflower, PyroWhopperflower`,

`PyroAgent, CicinCryoMage, CicinElectroMage, RuinGuard, RuinHunter, RuinGrader, ShieldBearerMitachurl, BlazingAxeMitachurl, FrostarmLawachurl, EyeOfStorm, CryoRegisvine, PyroRegisvine, AnemoHypostasis, ElectroHypostasis, GeoHypostasis`
