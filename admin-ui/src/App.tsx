import { useState, useEffect, useCallback, useRef } from "react";
import type { AdminStateSnapshot, PlayerPrimitive, EnemyPrimitive } from "./types";

type CardPile = "hand" | "discard" | "deck";

const ADMIN_WS_URL = "ws://localhost:8998";

const PLAYER_EFFECTS = [
  "Breastplate", "DominusLapidis", "ExplosivePuppet", "GlacialIllumination",
  "GuideOfAfterlife", "GuobaFire", "LayeredFrost", "LetTheShowBeginPlus",
  "MirrorReflections", "NiwabiFireDance", "Overheat", "Pyronado", "Raincutter",
  "SkywardSonnet", "SkywardSonnetPlus", "SolarIsotoma", "Stormbreaker", "TrailOfTheQilin",
];
const ENEMY_EFFECTS = ["Nightrider", "NightriderPlus"];
const ELEMENTS = ["Pyro", "Hydro", "Cryo", "Electro", "Anemo", "Geo", "Dendro"];

const ALL_ENEMIES = [
  "AnemoBoxer", "AnemoShamachurl", "CryoAbyssMage", "CryoCicinSwarm", "CryoGunner",
  "CryoHilichurlShooter", "CryoWhopperflower", "DendroShamachurl", "ElectroCicinSwarm",
  "ElectroHammer", "ElectroHilichurlShooter", "GeoChanter", "GeoShamachurl",
  "GiantAnemoSlime", "GiantCryoSlime", "GiantDendroSlime", "GiantElectroSlime",
  "GiantGeoSlime", "GiantHydroSlime", "GiantPyroSlime", "HilichurlBerserk",
  "HilichurlGang", "HilichurlGrenadier", "HilichurlGuard", "HydroAbyssMage",
  "HydroGunner", "PyroAbyssMage", "PyroHilichurlShooter", "PyroSlinger",
  "PyroWhopperflower", "SmallAnemoSlime", "SmallCryoSlime", "SmallDendroSlime",
  "SmallElectroSlime", "SmallGeoSlime", "SmallHydroSlime", "SmallPyroSlime",
  "TreasureHoarderGang", "UnusualHilichurl", "VishapHatchling",
  "AnemoHypostasis", "BlazingAxeMitachurl", "CicinCryoMage", "CicinElectroMage",
  "CryoRegisvine", "ElectroHypostasis", "EyeOfStorm", "FrostarmLawachurl",
  "GeoHypostasis", "PyroAgent", "PyroRegisvine", "RuinGrader", "RuinGuard",
  "RuinHunter", "ShieldBearerMitachurl", "StonehideLawachurl",
];

const ALL_CARDS = [
  "StarfellSword", "StarfellSwordPlus", "ForeignRockblade", "ForeignRockbladePlus",
  "WeissBladework", "WeissBladeworkPlus", "SolarIsotoma", "SolarIsotomaPlus",
  "Sharpshooter", "SharpshooterPlus", "ExplosivePuppet", "ExplosivePuppetPlus",
  "WhisperOfWater", "WhisperOfWaterPlus", "LetTheShowBegin", "LetTheShowBeginPlus",
  "Oceanborn", "OceanbornPlus", "Tidecaller", "TidecallerPlus",
  "StrikeOfFortune", "StrikeOfFortunePlus", "PassionOverload", "PassionOverloadPlus",
  "LayeredFrost", "LayeredFrostPlus", "Demonbane", "DemonbanePlus",
  "SearingOnslaught", "SearingOnslaughtPlus", "TemperedSword", "TemperedSwordPlus",
  "KatzleinStyle", "KatzleinStylePlus", "IcyPaws", "IcyPawsPlus",
  "IcetideVortex", "IcetideVortexPlus", "EdelBladework", "EdelBladeworkPlus",
  "BoltsOfDownfall", "BoltsOfDownfallPlus", "Nightrider", "NightriderPlus",
  "LiutianArchery", "LiutianArcheryPlus", "TrailOfTheQilin", "TrailOfTheQilinPlus",
  "GuideOfAfterlife", "GuideOfAfterlifePlus", "SpearOfWangsheng", "SpearOfWangshengPlus",
  "FavoniusBladework", "FavoniusBladeworkPlus", "GaleBlade", "GaleBladePlus",
  "CeremonialBladework", "CeremonialBladeworkPlus", "Frostgnaw", "FrostgnawPlus",
  "Chihayaburu", "ChihayaburuPlus", "GaryuuBladework", "GaryuuBladeworkPlus",
  "StellarRestoration", "StellarRestorationPlus", "YunlaiSwordsmanship", "YunlaiSwordsmanshipPlus",
  "Kaboom", "KaboomPlus", "JumpyDumpty", "JumpyDumptyPlus",
  "LightningTouch", "LightningTouchPlus", "VioletArc", "VioletArcPlus",
  "ForeignIronwind", "ForeignIronwindPlus", "PalmVortex", "PalmVortexPlus",
  "MirrorReflections", "MirrorReflectionsPlus", "RippleOfFate", "RippleOfFatePlus",
  "JadeScreen", "JadeScreenPlus", "SparklingScatter", "SparklingScatterPlus",
  "Breastplate", "BreastplatePlus", "MaidsBladework", "MaidsBladeworkPlus",
  "AncientSwordArt", "AncientSwordArtPlus", "HeraldOfFrost", "HeraldOfFrostPlus",
  "BalefulOmen", "BalefulOmenPlus", "Origin", "OriginPlus",
  "ClawAndThunder", "ClawAndThunderPlus", "SteelFang", "SteelFangPlus",
  "RavagingConfession", "RavagingConfessionPlus", "SpearOfTheChurch", "SpearOfTheChurchPlus",
  "AnemoHypostatis", "AnemoHypostatisPlus", "WindSpiritCreation", "WindSpiritCreationPlus",
  "CuttingTorrent", "CuttingTorrentPlus", "RagingTide", "RagingTidePlus",
  "DivineArchery", "DivineArcheryPlus", "SkywardSonnet", "SkywardSonnetPlus",
  "DoughFu", "DoughFuPlus", "GuobaFire", "GuobaFirePlus",
  "LemniscaticWind", "LemniscaticWindPlus", "WhirlwindThrust", "WhirlwindThrustPlus",
  "GuhuaStyle", "GuhuaStylePlus", "FatalRainscreen", "FatalRainscreenPlus",
  "DanceOfFire", "DanceOfFirePlus", "SweepingFervor", "SweepingFervorPlus",
  "SealOfApproval", "SealOfApprovalPlus", "SignedEdict", "SignedEdictPlus",
  "FireworkFlareUp", "FireworkFlareUpPlus", "NiwabiFireDance", "NiwabiFireDancePlus",
  "DominusLapidis", "DominusLapidisPlus", "RainOfStone", "RainOfStonePlus",
  "Burn", "Dash", "Freeze", "Overheat",
];

export type GameLogEntry =
  | { id: number; dir: "in"; time: number; playerId: string; request: unknown }
  | { id: number; dir: "out"; time: number; kind: string; payload: unknown; targetPlayerId: string | null };

const MAX_GAME_LOG = 200;

function App() {
  const [state, setState] = useState<AdminStateSnapshot | null>(null);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  const [wsStatus, setWsStatus] = useState<"connecting" | "open" | "closed" | "error">("connecting");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const socket = new WebSocket(ADMIN_WS_URL);
    socket.onopen = () => {
      setWsStatus("open");
      socket.send(JSON.stringify({ action: "admin.getState" }));
    };
    socket.onclose = () => setWsStatus("closed");
    socket.onerror = () => setWsStatus("error");
    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(typeof event.data === "string" ? event.data : "");
        if (msg.action === "admin.state") {
          setState({ isGameStart: msg.isGameStart, cycle: msg.cycle, players: msg.players ?? [] });
        } else if (msg.action === "admin.gameMessage") {
          setGameLog((prev) => {
            const entry: GameLogEntry = {
              id: nextId.current++, dir: "in",
              time: msg.time ?? Date.now(), playerId: msg.playerId, request: msg.request,
            };
            return [...prev, entry].sort((a, b) => a.time - b.time).slice(-MAX_GAME_LOG);
          });
        } else if (msg.action === "admin.gameOutgoing") {
          setGameLog((prev) => {
            const entry: GameLogEntry = {
              id: nextId.current++, dir: "out",
              time: msg.time ?? Date.now(), kind: msg.kind ?? "send",
              payload: msg.payload, targetPlayerId: msg.targetPlayerId ?? null,
            };
            return [...prev, entry].sort((a, b) => a.time - b.time).slice(-MAX_GAME_LOG);
          });
        }
      } catch {}
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const sendAdmin = useCallback(
    (action: string, payload: Record<string, unknown>) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action, ...payload }));
      }
    },
    [ws],
  );

  return (
    <div>
      <h1>Genshin Tarot Admin</h1>
      <div className={`status status--${wsStatus === "open" ? "ok" : wsStatus === "error" ? "error" : "loading"}`}>
        WebSocket: {wsStatus}
      </div>

      {state && <GlobalPanel state={state} onSend={sendAdmin} />}

      {state && state.players.length === 0 && <p className="card">Нет подключённых игроков.</p>}
      {state && state.players.length > 0 && (
        <div className="grid">
          {state.players.map((player) => (
            <PlayerCard key={player.playerId} player={player} onSend={sendAdmin} />
          ))}
        </div>
      )}

      <section className="card" style={{ marginTop: "1.5rem" }}>
        <h2>Лог запросов (game WS)</h2>
        {gameLog.length === 0 ? (
          <p style={{ color: "#a9b1d6", fontSize: "0.9rem" }}>Пока нет сообщений</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "500px", overflowY: "auto" }}>
            {gameLog.map((entry) => (
              <li key={entry.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #565f89", fontSize: "0.85rem", fontFamily: "monospace" }}>
                <span style={{ color: "#7aa2f7", marginRight: "0.5rem" }}>{new Date(entry.time).toLocaleTimeString()}</span>
                {entry.dir === "in" ? (
                  <>
                    <span style={{ color: "#f7768e", marginRight: "0.5rem" }}>in</span>
                    <span style={{ color: "#9ece6a", marginRight: "0.5rem" }}>{entry.playerId}</span>
                    <pre style={{ margin: "0.25rem 0 0 0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                      {JSON.stringify(entry.request)}
                    </pre>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#bb9af7", marginRight: "0.5rem" }}>out {entry.kind}</span>
                    {entry.targetPlayerId && (
                      <span style={{ color: "#9ece6a", marginRight: "0.5rem" }}>{" -> "}{entry.targetPlayerId}</span>
                    )}
                    <pre style={{ margin: "0.25rem 0 0 0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                      {JSON.stringify(entry.payload)}
                    </pre>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function GlobalPanel({
  state,
  onSend,
}: {
  state: AdminStateSnapshot;
  onSend: (action: string, payload: Record<string, unknown>) => void;
}) {
  const [cycle, setCycle] = useState(state.cycle);
  const [isGameStart, setIsGameStart] = useState(state.isGameStart);

  useEffect(() => {
    setCycle(state.cycle);
    setIsGameStart(state.isGameStart);
  }, [state]);

  return (
    <div className="card" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
      <strong>Глобально:</strong>
      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        Цикл
        <input type="number" min={0} max={12} value={cycle}
          onChange={(e) => setCycle(Number(e.target.value))} style={{ width: "4rem" }} />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <input type="checkbox" checked={isGameStart} onChange={(e) => setIsGameStart(e.target.checked)} />
        Игра начата
      </label>
      <button type="button" onClick={() => onSend("admin.setState", { cycle, isGameStart })}>
        Применить
      </button>
    </div>
  );
}

function ArrayBadges({
  values,
  all,
  onChange,
}: {
  values: string[];
  all: string[];
  onChange: (next: string[]) => void;
}) {
  const available = all.filter((v) => !values.includes(v));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", alignItems: "center", marginTop: "0.25rem" }}>
      {values.length === 0 && <span style={{ color: "#565f89" }}>—</span>}
      {values.map((v) => (
        <span
          key={v}
          className="badge badge--effect"
          style={{ cursor: "pointer" }}
          title="Нажмите, чтобы удалить"
          onClick={() => onChange(values.filter((x) => x !== v))}
        >
          {v} ×
        </span>
      ))}
      {available.length > 0 && (
        <select
          value=""
          onChange={(e) => { if (e.target.value) onChange([...values, e.target.value]); }}
          style={{ fontSize: "0.8rem", padding: "0.1rem 0.3rem" }}
        >
          <option value="">+ добавить</option>
          {available.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      )}
    </div>
  );
}

function EnemyPanel({
  enemy,
  playerId,
  onSend,
}: {
  enemy: EnemyPrimitive;
  playerId: string;
  onSend: (action: string, payload: Record<string, unknown>) => void;
}) {
  const [hp, setHp] = useState(enemy.hp);
  const [shield, setShield] = useState(enemy.shield);
  const [isStunned, setIsStunned] = useState(enemy.isStunned);
  const [elements, setElements] = useState<string[]>(enemy.elements);
  const [effects, setEffects] = useState<string[]>(enemy.effects);

  useEffect(() => {
    setHp(enemy.hp);
    setShield(enemy.shield);
    setIsStunned(enemy.isStunned);
    setElements(enemy.elements);
    setEffects(enemy.effects);
  }, [enemy]);

  const apply = () => {
    onSend("admin.setState", {
      players: [{ playerId, enemies: [{ id: enemy.id, hp, shield, isStunned, elements, effects }] }],
    });
  };

  return (
    <div style={{ border: "1px solid #565f89", borderRadius: "6px", padding: "0.6rem", marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <strong style={{ fontSize: "0.9rem" }}>{enemy.name}</strong>
        <span style={{ fontSize: "0.7rem", color: "#565f89" }}>{enemy.id.slice(-8)}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.85rem", marginBottom: "0.4rem", alignItems: "flex-end" }}>
        <label>
          HP
          <br />
          <input type="number" min={0} value={hp}
            onChange={(e) => setHp(Number(e.target.value))} style={{ width: "4rem" }} />
        </label>
        <label>
          Щит
          <br />
          <input type="number" min={0} value={shield}
            onChange={(e) => setShield(Number(e.target.value))} style={{ width: "4rem" }} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <input type="checkbox" checked={isStunned} onChange={(e) => setIsStunned(e.target.checked)} />
          Оглушён
        </label>
      </div>

      <div style={{ fontSize: "0.8rem", marginBottom: "0.3rem" }}>
        Элементы:
        <ArrayBadges values={elements} all={ELEMENTS} onChange={setElements} />
      </div>

      <div style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
        Эффекты:
        <ArrayBadges values={effects} all={ENEMY_EFFECTS} onChange={setEffects} />
      </div>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button type="button" onClick={apply} style={{ fontSize: "0.8rem" }}>Применить</button>
        <button
          type="button"
          onClick={() => onSend("admin.killEnemy", { enemyId: enemy.id })}
          style={{ fontSize: "0.8rem", background: "#f7768e", color: "#1a1b2e" }}
        >
          Убить
        </button>
        <button
          type="button"
          onClick={() => onSend("admin.removeEnemy", { enemyId: enemy.id })}
          style={{ fontSize: "0.8rem", background: "#565f89", color: "#c0caf5" }}
          title="Удалить без событий смерти"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

function AddEnemyWidget({
  playerId,
  onSend,
}: {
  playerId: string;
  onSend: (action: string, payload: Record<string, unknown>) => void;
}) {
  const [selectedEnemy, setSelectedEnemy] = useState(ALL_ENEMIES[0]);

  return (
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginTop: "0.5rem", flexWrap: "wrap" }}>
      <select
        value={selectedEnemy}
        onChange={(e) => setSelectedEnemy(e.target.value)}
        style={{ fontSize: "0.8rem", padding: "0.2rem 0.4rem", flex: 1, minWidth: 0 }}
      >
        {ALL_ENEMIES.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onSend("admin.addEnemy", { playerId, enemyName: selectedEnemy })}
        style={{ fontSize: "0.8rem", background: "#9ece6a", color: "#1a1b2e", whiteSpace: "nowrap" }}
      >
        + Враг
      </button>
    </div>
  );
}

function AddCardWidget({
  playerId,
  pile,
  onSend,
}: {
  playerId: string;
  pile: CardPile;
  onSend: (action: string, payload: Record<string, unknown>) => void;
}) {
  const [selectedCard, setSelectedCard] = useState(ALL_CARDS[0]);

  return (
    <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", marginTop: "0.4rem", flexWrap: "wrap" }}>
      <select
        value={selectedCard}
        onChange={(e) => setSelectedCard(e.target.value)}
        style={{ fontSize: "0.75rem", padding: "0.15rem 0.3rem", flex: 1, minWidth: 0 }}
      >
        {ALL_CARDS.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onSend("admin.addCard", { playerId, cardName: selectedCard, to: pile })}
        style={{ fontSize: "0.75rem", background: "#7aa2f7", color: "#1a1b2e", whiteSpace: "nowrap" }}
      >
        + Карта
      </button>
    </div>
  );
}

function PlayerCard({
  player,
  onSend,
}: {
  player: PlayerPrimitive;
  onSend: (action: string, payload: Record<string, unknown>) => void;
}) {
  const [hp, setHp] = useState(player.hp);
  const [shields, setShields] = useState(player.shields);
  const [energy, setEnergy] = useState(player.energy);
  const [mora, setMora] = useState(player.mora);
  const [wave, setWave] = useState(player.wave);
  const [eulaSnowflakes, setEulaSnowflakes] = useState(player.eulaSnowflakes);
  const [apNormal, setApNormal] = useState(player.actionPoints.normal);
  const [apExtra, setApExtra] = useState(player.actionPoints.extra);
  const [effects, setEffects] = useState<string[]>(player.effects);

  useEffect(() => {
    setHp(player.hp);
    setShields(player.shields);
    setEnergy(player.energy);
    setMora(player.mora);
    setWave(player.wave);
    setEulaSnowflakes(player.eulaSnowflakes);
    setApNormal(player.actionPoints.normal);
    setApExtra(player.actionPoints.extra);
    setEffects(player.effects);
  }, [player]);

  const applyStats = () => {
    onSend("admin.setState", {
      players: [{
        playerId: player.playerId,
        hp, shields, energy, mora, wave, eulaSnowflakes,
        actionPoints: { normal: apNormal, extra: apExtra },
        effects,
      }],
    });
  };

  const deckSorted = [...player.deck].sort((a, b) => (a.deckPosition ?? 0) - (b.deckPosition ?? 0));

  const handleDragStart = (e: React.DragEvent, cardId: string, from: CardPile) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ playerId: player.playerId, cardId, from }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, to: CardPile) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;
      const { playerId, cardId, from } = JSON.parse(raw) as { playerId: string; cardId: string; from: CardPile };
      if (from === to || playerId !== player.playerId) return;
      onSend("admin.moveCard", { playerId, cardId, from, to });
    } catch {}
  };

  const CARD_PILES: { key: CardPile; label: string; cards: typeof player.hand }[] = [
    { key: "hand", label: "Рука", cards: player.hand },
    { key: "discard", label: "Сброс", cards: player.discard },
    { key: "deck", label: "Колода добора", cards: deckSorted },
  ];

  return (
    <div className="card">
      <h3 style={{ wordBreak: "break-all", fontSize: "0.9rem", marginBottom: "0.25rem" }}>{player.playerId}</h3>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "#a9b1d6" }}>
        {player.characters.join(", ") || "Без персонажей"}
      </p>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem 0.6rem", fontSize: "0.85rem", marginBottom: "0.6rem" }}>
        <label>HP<br /><input type="number" min={0} max={12} value={hp} onChange={(e) => setHp(+e.target.value)} style={{ width: "100%" }} /></label>
        <label>Щит<br /><input type="number" min={0} max={12} value={shields} onChange={(e) => setShields(+e.target.value)} style={{ width: "100%" }} /></label>
        <label>Энергия<br /><input type="number" min={0} max={12} value={energy} onChange={(e) => setEnergy(+e.target.value)} style={{ width: "100%" }} /></label>
        <label>Мора<br /><input type="number" min={0} value={mora} onChange={(e) => setMora(+e.target.value)} style={{ width: "100%" }} /></label>
        <label>Волна<br /><input type="number" min={0} max={5} value={wave} onChange={(e) => setWave(+e.target.value)} style={{ width: "100%" }} /></label>
        <label title="Снежинки Эулы">❄ Снежинки<br /><input type="number" min={0} value={eulaSnowflakes} onChange={(e) => setEulaSnowflakes(+e.target.value)} style={{ width: "100%" }} /></label>
        <label>AP норм.<br /><input type="number" min={0} max={3} value={apNormal} onChange={(e) => setApNormal(+e.target.value)} style={{ width: "100%" }} /></label>
        <label>AP доп.<br /><input type="number" min={0} max={3} value={apExtra} onChange={(e) => setApExtra(+e.target.value)} style={{ width: "100%" }} /></label>
      </div>

      {/* Player effects */}
      <div style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
        <strong>Эффекты:</strong>
        <ArrayBadges values={effects} all={PLAYER_EFFECTS} onChange={setEffects} />
      </div>

      <button type="button" onClick={applyStats} style={{ marginBottom: "1rem", width: "100%" }}>
        Применить стат игрока
      </button>

      {/* Enemies */}
      <div style={{ marginBottom: "0.75rem" }}>
        <strong style={{ fontSize: "0.9rem" }}>
          Враги ({player.enemies.length}):
        </strong>
        {player.enemies.length > 0 && (
          <div style={{ marginTop: "0.5rem" }}>
            {player.enemies.map((enemy) => (
              <EnemyPanel key={enemy.id} enemy={enemy} playerId={player.playerId} onSend={onSend} />
            ))}
          </div>
        )}
        <AddEnemyWidget playerId={player.playerId} onSend={onSend} />
      </div>

      {/* Card piles */}
      {CARD_PILES.map(({ key, label, cards }) => (
        <details key={key} style={{ marginTop: "0.25rem" }}>
          <summary>{label} ({cards.length})</summary>
          <ul
            style={{ listStyle: "none", padding: 0, margin: "0.25rem 0 0 0", fontSize: "0.9rem", minHeight: "1.5rem" }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, key)}
          >
            {cards.map((c, i) => (
              <li
                key={c.cardId}
                draggable
                onDragStart={(e) => handleDragStart(e, c.cardId, key)}
                style={{ cursor: "grab", padding: "0.15rem 0" }}
              >
                {i + 1}. {c.name}
                {c.deckPosition != null && (
                  <span style={{ color: "#565f89", marginLeft: "0.25rem" }}>(pos {c.deckPosition})</span>
                )}
              </li>
            ))}
            {cards.length === 0 && <li style={{ color: "#565f89" }}>—</li>}
          </ul>
          <AddCardWidget playerId={player.playerId} pile={key} onSend={onSend} />
        </details>
      ))}
    </div>
  );
}

export default App;
