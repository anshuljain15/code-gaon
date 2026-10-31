export interface PyResult {
  stdout: string;
  error: string | null;
  results: { ok: boolean; error?: string }[];
}

type Reply =
  | { id: number; type: 'ready' }
  | ({ id: number; type: 'result' } & PyResult)
  | { id: number; type: 'fatal'; error: string };

export class TimeoutError extends Error {}

const RUN_TIMEOUT_MS = 8000;

/** One shared Python worker; replaced if student code has to be killed. */
class PyRunner {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, (r: Reply) => void>();

  private getWorker() {
    if (!this.worker) {
      this.worker = new Worker('./py-worker.js');
      this.worker.onmessage = (e: MessageEvent<Reply>) => {
        this.pending.get(e.data.id)?.(e.data);
        this.pending.delete(e.data.id);
      };
    }
    return this.worker;
  }

  private send(msg: Record<string, unknown>, timeoutMs?: number): Promise<Reply> {
    const id = this.nextId++;
    const worker = this.getWorker();
    return new Promise((resolve, reject) => {
      let timer: number | undefined;
      if (timeoutMs) {
        timer = window.setTimeout(() => {
          this.pending.delete(id);
          worker.terminate();
          this.worker = null;
          reject(new TimeoutError('timeout'));
        }, timeoutMs);
      }
      this.pending.set(id, (r) => {
        window.clearTimeout(timer);
        resolve(r);
      });
      worker.postMessage({ id, ...msg });
    });
  }

  async load(): Promise<void> {
    const r = await this.send({ type: 'load' });
    if (r.type === 'fatal') throw new Error(r.error);
  }

  async run(code: string, tests: string[]): Promise<PyResult> {
    await this.load();
    const r = await this.send({ type: 'run', code, tests }, RUN_TIMEOUT_MS);
    if (r.type === 'fatal') throw new Error(r.error);
    if (r.type !== 'result') throw new Error('unexpected reply');
    return r;
  }
}

export const python = new PyRunner();
