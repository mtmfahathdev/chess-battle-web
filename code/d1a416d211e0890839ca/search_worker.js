// Runs the chess AI (the chess_worker crate) off the game's thread; see game/src/search.rs.
// Messages are [id, "best", fen, depth, noise, seed] or [id, "hint", fen, history, nodes];
// the answer is [id, move], the move in coordinate notation or "" if there is none.
import init, { best_move, hint } from "./chess_worker.js";

const ready = init({ module_or_path: new URL("./chess_worker_bg.wasm", import.meta.url) });

onmessage = async (event) => {
  await ready;
  const [id, kind, fen, ...rest] = event.data;
  const move =
    kind === "best"
      ? best_move(fen, Number(rest[0]), Number(rest[1]), BigInt(rest[2]))
      : hint(fen, rest[0], BigInt(rest[1]));
  postMessage([id, move]);
};
