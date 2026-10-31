import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import * as Hi from 'blockly/msg/hi';
import type { GridBlock, GridLevelDef, Lang, Stmt, Text } from '../../core/types';

const TYPE: Record<GridBlock | 'start', string> = {
  start: 'cg_start',
  forward: 'cg_forward',
  left: 'cg_left',
  right: 'cg_right',
  light: 'cg_light',
  repeat: 'cg_repeat',
};

const LABEL: Record<GridBlock | 'start', Text> = {
  start: { en: '▶ Start', hi: '▶ शुरू' },
  forward: { en: 'move forward ⬆️', hi: 'आगे चलो ⬆️' },
  left: { en: 'turn left ↩️', hi: 'बाएँ मुड़ो ↩️' },
  right: { en: 'turn right ↪️', hi: 'दाएँ मुड़ो ↪️' },
  light: { en: 'light the diya 🪔', hi: 'दीया जलाओ 🪔' },
  repeat: { en: 'repeat %1 times', hi: '%1 बार दोहराओ' },
};

const COLOUR = { start: 30, move: 210, light: 45, loop: 120 };

const defineBlocks = (lang: Lang) => {
  for (const type of Object.values(TYPE)) delete Blockly.Blocks[type];
  const action = (b: Exclude<GridBlock, 'repeat'>, colour: number) => ({
    type: TYPE[b],
    message0: LABEL[b][lang],
    previousStatement: null,
    nextStatement: null,
    colour,
  });
  Blockly.defineBlocksWithJsonArray([
    { type: TYPE.start, message0: LABEL.start[lang], nextStatement: null, colour: COLOUR.start },
    action('forward', COLOUR.move),
    action('left', COLOUR.move),
    action('right', COLOUR.move),
    action('light', COLOUR.light),
    {
      type: TYPE.repeat,
      message0: LABEL.repeat[lang],
      args0: [{ type: 'field_number', name: 'TIMES', value: 3, min: 1, max: 20, precision: 1 }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: COLOUR.loop,
    },
  ]);
};

const OP_BY_TYPE = Object.fromEntries(Object.entries(TYPE).map(([op, type]) => [type, op])) as Record<
  string,
  GridBlock | 'start'
>;

const toAst = (first: Blockly.Block | null): Stmt[] => {
  const out: Stmt[] = [];
  for (let b = first; b; b = b.getNextBlock()) {
    const op = OP_BY_TYPE[b.type];
    if (op === 'repeat') {
      out.push({ op, times: Number(b.getFieldValue('TIMES')) || 1, body: toAst(b.getInputTargetBlock('DO')), id: b.id });
    } else if (op && op !== 'start') {
      out.push({ op, id: b.id });
    }
  }
  return out;
};

type BlockState = Record<string, unknown>;

const toState = (stmts: Stmt[]): BlockState | undefined =>
  stmts.reduceRight<BlockState | undefined>((next, s) => {
    const block: BlockState = { type: TYPE[s.op] };
    if (s.op === 'repeat') {
      block.fields = { TIMES: s.times };
      const body = toState(s.body);
      if (body) block.inputs = { DO: { block: body } };
    }
    if (next) block.next = { block: next };
    return block;
  }, undefined);

export interface BlocklyHost {
  getProgram(): Stmt[];
  highlight(id: string | null): void;
  dispose(): void;
}

export const mount = (el: HTMLElement, level: GridLevelDef, lang: Lang, initial?: Stmt[]): BlocklyHost => {
  Blockly.setLocale((lang === 'hi' ? Hi : En) as unknown as Record<string, string>);
  defineBlocks(lang);

  const ws = Blockly.inject(el, {
    toolbox: { kind: 'flyoutToolbox', contents: level.blocks.map((b) => ({ kind: 'block', type: TYPE[b] })) },
    renderer: 'zelos',
    media: './blockly-media/',
    sounds: false,
    trashcan: true,
    move: { scrollbars: true, drag: true, wheel: false },
    zoom: { controls: true, startScale: 0.75, maxScale: 1.5, minScale: 0.4 },
  });

  const start = toState(initial ?? level.starter ?? []);
  Blockly.serialization.workspaces.load(
    {
      blocks: {
        languageVersion: 0,
        blocks: [{ type: TYPE.start, x: 16, y: 16, deletable: false, ...(start ? { next: { block: start } } : {}) }],
      },
    },
    ws,
  );

  const startBlock = () => ws.getBlocksByType(TYPE.start, false)[0];

  return {
    getProgram: () => toAst(startBlock()?.getNextBlock() ?? null),
    highlight: (id) => ws.highlightBlock(id),
    dispose: () => ws.dispose(),
  };
};
