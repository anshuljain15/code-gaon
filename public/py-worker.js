/* global importScripts, loadPyodide */
// Runs student Python in a separate thread so an infinite loop can be stopped without freezing the page.
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

let pyodideReady = null;

function getPyodide() {
  if (!pyodideReady) {
    pyodideReady = (async () => {
      importScripts(PYODIDE_URL + 'pyodide.js');
      const py = await loadPyodide({ indexURL: PYODIDE_URL });
      py.setStdin({ error: true });
      return py;
    })();
  }
  return pyodideReady;
}

// Keep only the part of a Python traceback a beginner needs: the line number and the last error line.
function friendlyError(err) {
  const text = String((err && err.message) || err);
  const lines = text.trim().split('\n');
  const last = lines[lines.length - 1];
  const where = [...lines].reverse().find((l) => /File "<exec>", line \d+/.test(l));
  const lineNo = where && where.match(/line (\d+)/)[1];
  return lineNo ? `Line ${lineNo}: ${last}` : last;
}

self.onmessage = async (event) => {
  const { id, type, code, tests } = event.data;
  try {
    const py = await getPyodide();
    if (type === 'load') {
      self.postMessage({ id, type: 'ready' });
      return;
    }
    let stdout = '';
    py.setStdout({ batched: (s) => (stdout += s + '\n') });
    py.setStderr({ batched: (s) => (stdout += s + '\n') });
    const globals = py.globals.get('dict')();
    let error = null;
    const results = [];
    try {
      await py.runPythonAsync(code, { globals });
    } catch (err) {
      error = friendlyError(err);
    }
    if (!error) {
      for (const test of tests) {
        try {
          await py.runPythonAsync(test, { globals });
          results.push({ ok: true });
        } catch (err) {
          results.push({ ok: false, error: friendlyError(err) });
        }
      }
    }
    globals.destroy();
    self.postMessage({ id, type: 'result', stdout, error, results });
  } catch (err) {
    pyodideReady = null;
    self.postMessage({ id, type: 'fatal', error: String((err && err.message) || err) });
  }
};
