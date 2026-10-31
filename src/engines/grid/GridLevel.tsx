import { useEffect, useRef, useState } from 'preact/hooks';
import type { EngineProps, GridLevelDef, Stmt } from '../../core/types';
import { tr } from '../../core/i18n';
import { speak } from '../../core/voice';
import type { BlocklyHost } from './blockly-host';
import { countBlocks, initialState, key, runProgram, type WorldState } from './world';

const CELL = 44;
const STEP_MS = 380;
const TILE: Record<string, string> = { '#': '🌳', G: '🏫', S: '🏠' };
const ARROW_ROTATION = [0, 90, 180, 270];

export function GridLevel({ level, lang, onComplete }: EngineProps<GridLevelDef>) {
  const blocklyEl = useRef<HTMLDivElement>(null);
  const host = useRef<BlocklyHost | null>(null);
  const timer = useRef<number>();
  const [state, setState] = useState<WorldState>(() => initialState(level));
  const [message, setMessage] = useState<{ text: string; kind: 'info' | 'error' | 'ok' } | null>(null);
  const [running, setRunning] = useState(false);
  const [blockCount, setBlockCount] = useState(0);

  useEffect(() => {
    let disposed = false;
    const previous: Stmt[] | undefined = host.current?.getProgram();
    host.current?.dispose();
    host.current = null;
    import('./blockly-host').then(({ mount }) => {
      if (disposed || !blocklyEl.current) return;
      host.current = mount(blocklyEl.current, level, lang, previous);
    });
    return () => {
      disposed = true;
    };
  }, [level, lang]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      host.current?.dispose();
      host.current = null;
    },
    [],
  );

  const reset = () => {
    window.clearTimeout(timer.current);
    host.current?.highlight(null);
    setRunning(false);
    setState(initialState(level));
    setMessage(null);
  };

  const say = (text: string, kind: 'info' | 'error' | 'ok') => {
    setMessage({ text, kind });
    speak(text, lang);
  };

  const run = () => {
    const program = host.current?.getProgram() ?? [];
    reset();
    if (program.length === 0) return say(tr('emptyProgram', lang), 'info');
    const used = countBlocks(program);
    setBlockCount(used);
    const { frames, outcome } = runProgram(level, program);
    setRunning(true);
    let i = 0;
    const tick = () => {
      const frame = frames[i];
      setState(frame);
      host.current?.highlight(frame.blockId ?? null);
      i++;
      if (i < frames.length) {
        timer.current = window.setTimeout(tick, STEP_MS);
        return;
      }
      setRunning(false);
      host.current?.highlight(null);
      if (outcome === 'win' && level.maxBlocks && used > level.maxBlocks) say(tr('tooManyBlocks', lang), 'error');
      else if (outcome === 'win') onComplete();
      else if (outcome === 'crash') say(tr('crashed', lang), 'error');
      else say(tr('notThereYet', lang), 'info');
    };
    tick();
  };

  const rows = level.map.length;
  const cols = Math.max(...level.map.map((r) => r.length));

  return (
    <div class="grid-engine">
      <svg
        class="board"
        viewBox={`0 0 ${cols * CELL} ${rows * CELL}`}
        role="img"
        aria-label="Chintu Bot map"
      >
        {level.map.flatMap((row, y) =>
          [...row].map((ch, x) => {
            const lit = state.lit.includes(key({ x, y }));
            return (
              <g key={`${x}-${y}`} transform={`translate(${x * CELL} ${y * CELL})`}>
                <rect class={ch === '#' ? 'tile tile-tree' : 'tile tile-path'} width={CELL - 2} height={CELL - 2} x={1} y={1} rx={8} />
                {ch === 'D' && lit && <circle class="diya-glow" cx={CELL / 2} cy={CELL / 2} r={CELL / 2.4} />}
                {(TILE[ch] || ch === 'D') && (
                  <text x={CELL / 2} y={CELL / 2 + 9} text-anchor="middle" font-size="24" class={ch === 'D' && !lit ? 'unlit' : ''}>
                    {ch === 'D' ? '🪔' : TILE[ch]}
                  </text>
                )}
              </g>
            );
          }),
        )}
        <g class="robot" transform={`translate(${state.robot.x * CELL} ${state.robot.y * CELL})`}>
          <text x={CELL / 2} y={CELL / 2 + 9} text-anchor="middle" font-size="26">
            🤖
          </text>
          <g transform={`rotate(${ARROW_ROTATION[state.dir]} ${CELL / 2} ${CELL / 2})`}>
            <path class="robot-arrow" d={`M${CELL / 2 - 6} 9 L${CELL / 2} 1 L${CELL / 2 + 6} 9 Z`} />
          </g>
        </g>
      </svg>

      {message && (
        <p class={`engine-msg ${message.kind}`} role="status">
          {message.text}
        </p>
      )}

      <div class="controls">
        <button class="btn primary" onClick={run} disabled={running}>
          ▶ {tr('run', lang)}
        </button>
        <button class="btn" onClick={reset}>
          ↺ {tr('reset', lang)}
        </button>
        {level.maxBlocks && (
          <span class="pill">
            {tr('blocksUsed', lang)}: {blockCount || '-'} / {level.maxBlocks}
          </span>
        )}
      </div>

      <div ref={blocklyEl} class="blockly-area" />
    </div>
  );
}
