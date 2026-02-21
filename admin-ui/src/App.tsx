import { useState, useEffect, useCallback, useRef } from "react";
import type { AdminStateSnapshot, PlayerPrimitive } from "./types";

type CardPile = "hand" | "discard" | "deck";

const ADMIN_WS_URL = "ws://localhost:8998";

export type GameLogEntry =
  | { id: number; dir: "in"; time: number; playerId: string; request: unknown }
  | {
      id: number;
      dir: "out";
      time: number;
      kind: string;
      payload: unknown;
      targetPlayerId: string | null;
    };

const MAX_GAME_LOG = 200;

function App() {
  const [state, setState] = useState<AdminStateSnapshot | null>(null);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  const [wsStatus, setWsStatus] = useState<"connecting" | "open" | "closed" | "error">(
    "connecting",
  );
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const url = ADMIN_WS_URL;
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setWsStatus("open");
      setError(null);
      socket.send(JSON.stringify({ action: "admin.getState" }));
    };
    socket.onclose = () => setWsStatus("closed");
    socket.onerror = () => setWsStatus("error");

    socket.onmessage = (event) => {
      try {
        const raw = typeof event.data === "string" ? event.data : "";
        const msg = JSON.parse(raw);
        if (msg.action === "admin.state") {
          setState({
            isGameStart: msg.isGameStart,
            cycle: msg.cycle,
            players: msg.players ?? [],
          });
        } else if (msg.action === "admin.gameMessage") {
          setGameLog((prev) => {
            const entry: GameLogEntry = {
              id: nextId.current++,
              dir: "in",
              time: msg.time ?? Date.now(),
              playerId: msg.playerId,
              request: msg.request,
            };
            return [...prev, entry].sort((a, b) => a.time - b.time).slice(-MAX_GAME_LOG);
          });
        } else if (msg.action === "admin.gameOutgoing") {
          setGameLog((prev) => {
            const entry: GameLogEntry = {
              id: nextId.current++,
              dir: "out",
              time: msg.time ?? Date.now(),
              kind: msg.kind ?? "send",
              payload: msg.payload,
              targetPlayerId: msg.targetPlayerId ?? null,
            };
            return [...prev, entry].sort((a, b) => a.time - b.time).slice(-MAX_GAME_LOG);
          });
        }
      } catch (error) {}
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
      <div
        className={`status status--${wsStatus === "open" ? "ok" : wsStatus === "error" ? "error" : "loading"}`}
      >
        WebSocket: {wsStatus}
        {error && ` • ${error}`}
      </div>
      {state && (
        <>
          <p>
            Игра: {state.isGameStart ? "идёт" : "не начата"} • Цикл: {state.cycle}
          </p>
          <div className="grid">
            {state.players.map((player) => (
              <PlayerCard key={player.playerId} player={player} onSend={sendAdmin} />
            ))}
          </div>
        </>
      )}
      {state && state.players.length === 0 && <p className="card">Нет подключённых игроков.</p>}

      <section className="card" style={{ marginTop: "1.5rem" }}>
        <h2>Лог запросов (game WS) — по порядку</h2>
        {gameLog.length === 0 ? (
          <p style={{ color: "#a9b1d6", fontSize: "0.9rem" }}>Пока нет сообщений</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {gameLog.map((entry) => (
              <li
                key={entry.id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #565f89",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                }}
              >
                <span style={{ color: "#7aa2f7", marginRight: "0.5rem" }}>
                  {new Date(entry.time).toLocaleTimeString()}
                </span>
                {entry.dir === "in" ? (
                  <>
                    <span style={{ color: "#f7768e", marginRight: "0.5rem" }}>in</span>
                    <span style={{ color: "#9ece6a", marginRight: "0.5rem" }}>
                      {entry.playerId}
                    </span>
                    <pre
                      style={{
                        margin: "0.25rem 0 0 0",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {JSON.stringify(entry.request)}
                    </pre>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#bb9af7", marginRight: "0.5rem" }}>
                      {"out "}
                      {entry.kind}
                    </span>
                    {entry.targetPlayerId && (
                      <span style={{ color: "#9ece6a", marginRight: "0.5rem" }}>
                        {" -> "}
                        {entry.targetPlayerId}
                      </span>
                    )}
                    <pre
                      style={{
                        margin: "0.25rem 0 0 0",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
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

function PlayerCard({
  player,
  onSend,
}: {
  player: PlayerPrimitive;
  onSend: (action: string, payload: Record<string, unknown>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [hp, setHp] = useState(player.hp);
  const [energy, setEnergy] = useState(player.energy);
  const [shields, setShields] = useState(player.shields);
  const [mora, setMora] = useState(player.mora);
  const [apNormal, setApNormal] = useState(player.actionPoints.normal);
  const [apExtra, setApExtra] = useState(player.actionPoints.extra);

  useEffect(() => {
    setHp(player.hp);
    setEnergy(player.energy);
    setShields(player.shields);
    setMora(player.mora);
    setApNormal(player.actionPoints.normal);
    setApExtra(player.actionPoints.extra);
  }, [player]);

  const applyAll = () => {
    onSend("admin.updatePlayer", {
      playerId: player.playerId,
      hp,
      energy,
      shield: shields,
      mora,
      actionPoints: { normal: apNormal, extra: apExtra },
    });
    setEditing(false);
  };

  const normalLeft = player.actionPoints.normal;
  const normalSpent = 3 - normalLeft;
  const apStr =
    "◻".repeat(normalSpent) +
    "⬜".repeat(normalLeft) +
    " " +
    "🟧".repeat(player.actionPoints.extra);

  const deckSorted = [...player.deck].sort((a, b) => (a.deckPosition ?? 0) - (b.deckPosition ?? 0));

  const handleDragStart = (e: React.DragEvent, cardId: string, from: CardPile) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ playerId: player.playerId, cardId, from }),
    );
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
      const { playerId, cardId, from } = JSON.parse(raw) as {
        playerId: string;
        cardId: string;
        from: CardPile;
      };
      if (from === to || playerId !== player.playerId) return;
      onSend("admin.moveCard", { playerId, cardId, from, to });
    } catch (_) {
      // ignore
    }
  };

  return (
    <div className="card">
      <h3>{player.playerId}</h3>
      <p>Персонажи: {player.characters.join(", ") || "—"}</p>
      <p style={{ fontSize: "1.1rem" }}>
        {player.hp}♥ {player.shields}🛡 {player.energy}⚛ {player.mora}💰{" "}
        <span title="обычные / доп">{apStr}</span> Волна {player.wave}
      </p>
      <p>
        Эффекты:{" "}
        {player.effects.length
          ? player.effects.map((e) => (
              <span key={e} className="badge badge--effect">
                {e}
              </span>
            ))
          : "—"}
      </p>
      <p>
        Враги:{" "}
        {player.enemies.length
          ? player.enemies.map((e) => (
              <span key={e.id} className="badge badge--enemy">
                {e.name} {e.hp}♥
              </span>
            ))
          : "—"}
      </p>

      <details style={{ marginTop: "0.5rem" }}>
        <summary>Рука ({player.hand.length})</summary>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0.25rem 0 0 0",
            fontSize: "0.9rem",
            minHeight: "1.5rem",
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "hand")}
        >
          {player.hand.map((c, i) => (
            <li
              key={c.cardId}
              draggable
              onDragStart={(e) => handleDragStart(e, c.cardId, "hand")}
              style={{ cursor: "grab", padding: "0.15rem 0" }}
            >
              {i + 1}. {c.name}
              {c.deckPosition != null && (
                <span style={{ color: "#565f89", marginLeft: "0.25rem" }}>
                  (pos {c.deckPosition})
                </span>
              )}
            </li>
          ))}
          {player.hand.length === 0 && <li style={{ color: "#565f89" }}>—</li>}
        </ul>
      </details>
      <details style={{ marginTop: "0.25rem" }}>
        <summary>Сброс ({player.discard.length})</summary>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0.25rem 0 0 0",
            fontSize: "0.9rem",
            minHeight: "1.5rem",
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "discard")}
        >
          {player.discard.map((c, i) => (
            <li
              key={c.cardId}
              draggable
              onDragStart={(e) => handleDragStart(e, c.cardId, "discard")}
              style={{ cursor: "grab", padding: "0.15rem 0" }}
            >
              {i + 1}. {c.name}
              {c.deckPosition != null && (
                <span style={{ color: "#565f89", marginLeft: "0.25rem" }}>
                  (pos {c.deckPosition})
                </span>
              )}
            </li>
          ))}
          {player.discard.length === 0 && <li style={{ color: "#565f89" }}>—</li>}
        </ul>
      </details>
      <details style={{ marginTop: "0.25rem" }}>
        <summary>Колода добора ({player.deck.length})</summary>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0.25rem 0 0 0",
            fontSize: "0.9rem",
            minHeight: "1.5rem",
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "deck")}
        >
          {deckSorted.map((c, i) => (
            <li
              key={c.cardId}
              draggable
              onDragStart={(e) => handleDragStart(e, c.cardId, "deck")}
              style={{ cursor: "grab", padding: "0.15rem 0" }}
            >
              {i + 1}. {c.name}
              {c.deckPosition != null && (
                <span style={{ color: "#565f89", marginLeft: "0.25rem" }}>
                  (pos {c.deckPosition})
                </span>
              )}
            </li>
          ))}
          {player.deck.length === 0 && <li style={{ color: "#565f89" }}>—</li>}
        </ul>
      </details>

      {!editing ? (
        <button type="button" onClick={() => setEditing(true)}>
          Изменить статы
        </button>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <label>HP</label>
          <input
            type="number"
            min={0}
            max={12}
            value={hp}
            onChange={(e) => setHp(Number(e.target.value))}
          />
          <label>Энергия</label>
          <input
            type="number"
            min={0}
            max={12}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
          />
          <label>Щит</label>
          <input
            type="number"
            min={0}
            max={12}
            value={shields}
            onChange={(e) => setShields(Number(e.target.value))}
          />
          <label>Мора</label>
          <input
            type="number"
            min={0}
            value={mora}
            onChange={(e) => setMora(Number(e.target.value))}
          />
          <label>Очки действий (обычные / доп)</label>
          <input
            type="number"
            min={0}
            max={3}
            value={apNormal}
            onChange={(e) => setApNormal(Number(e.target.value))}
          />
          <input
            type="number"
            min={0}
            max={3}
            value={apExtra}
            onChange={(e) => setApExtra(Number(e.target.value))}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <button type="button" onClick={applyAll}>
              Применить всё
            </button>
            <button type="button" onClick={() => setEditing(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
