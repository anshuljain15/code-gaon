import { describe, expect, it } from 'vitest';
import { countBlocks, runProgram } from '../src/engines/grid/world';
import type { Stmt } from '../src/core/types';

const corridor = { map: ['S..G'], startDir: 1 as const, win: 'reach-goal' as const };

describe('grid world', () => {
  it('reaches the goal with the right steps', () => {
    const r = runProgram(corridor, [{ op: 'forward' }, { op: 'forward' }, { op: 'forward' }]);
    expect(r.outcome).toBe('win');
    expect(r.frames[r.frames.length - 1]?.robot).toEqual({ x: 3, y: 0 });
  });

  it('reports incomplete when the robot stops early', () => {
    expect(runProgram(corridor, [{ op: 'forward' }]).outcome).toBe('incomplete');
  });

  it('crashes into trees and the map edge', () => {
    expect(runProgram({ ...corridor, map: ['S#G'] }, [{ op: 'forward' }]).outcome).toBe('crash');
    expect(runProgram(corridor, [{ op: 'left' }, { op: 'forward' }]).outcome).toBe('crash');
  });

  it('stops running after a crash', () => {
    const r = runProgram({ ...corridor, map: ['S#G'] }, [{ op: 'forward' }, { op: 'right' }, { op: 'right' }]);
    expect(r.frames).toHaveLength(2);
  });

  it('turns left and right on a compass', () => {
    const r = runProgram(corridor, [{ op: 'right' }, { op: 'right' }, { op: 'right' }, { op: 'right' }, { op: 'left' }]);
    expect(r.frames.map((f) => f.dir)).toEqual([1, 2, 3, 0, 1, 0]);
  });

  it('lights diyas only on diya tiles, once each', () => {
    const level = { map: ['SDD'], startDir: 1 as const, win: 'light-all' as const };
    const r = runProgram(level, [{ op: 'light' }, { op: 'forward' }, { op: 'light' }, { op: 'light' }, { op: 'forward' }, { op: 'light' }]);
    expect(r.outcome).toBe('win');
    expect(r.frames[r.frames.length - 1]?.lit).toEqual(['1,0', '2,0']);
  });

  it('runs repeat blocks, including nested ones', () => {
    const program: Stmt[] = [{ op: 'repeat', times: 2, body: [{ op: 'repeat', times: 3, body: [{ op: 'right' }] }] }];
    expect(runProgram(corridor, program).frames).toHaveLength(7);
    expect(countBlocks(program)).toBe(3);
  });

  it('stops endless programs', () => {
    const program: Stmt[] = [{ op: 'repeat', times: 20, body: [{ op: 'repeat', times: 20, body: [{ op: 'repeat', times: 20, body: [{ op: 'left' }] }] }] }];
    expect(runProgram(corridor, program).outcome).toBe('too-long');
  });

  it('tags frames with the block that produced them', () => {
    const r = runProgram(corridor, [{ op: 'forward', id: 'b1' }]);
    expect(r.frames[1].blockId).toBe('b1');
  });
});
