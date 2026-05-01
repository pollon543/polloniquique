/** Salto automático tipo app.js (25 caracteres) */
export function wrapWithCursorMap(text, limit) {
  const src = String(text || '').replace(/\r/g, '');
  let out = '';
  const map = new Array(src.length + 1);
  let lineStartOut = 0;
  let lineLen = 0;
  let lastSpaceOutPos = -1;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    map[i] = out.length;

    if (ch === '\n') {
      out += ch;
      lineStartOut = out.length;
      lineLen = 0;
      lastSpaceOutPos = -1;
      continue;
    }

    out += ch;
    lineLen++;
    if (ch === ' ') lastSpaceOutPos = out.length - 1;

    if (lineLen > limit) {
      if (lastSpaceOutPos >= lineStartOut) {
        out = `${out.slice(0, lastSpaceOutPos)}\n${out.slice(lastSpaceOutPos + 1)}`;
        lineStartOut = lastSpaceOutPos + 1;
        lineLen = out.length - lineStartOut;
        lastSpaceOutPos = -1;
      } else {
        out = `${out.slice(0, out.length - 1)}\n${ch}`;
        lineStartOut = out.length - 1;
        lineLen = 1;
        lastSpaceOutPos = -1;
      }
    }
  }

  map[src.length] = out.length;
  return { out, map };
}

export function wrapText(text, limit = 25) {
  return wrapWithCursorMap(text, limit).out;
}

export function enforceWrapLimit(el, limit = 25) {
  if (!el) return;

  el.addEventListener('input', () => {
    const original = String(el.value || '').replace(/\r/g, '');
    const selStart = el.selectionStart ?? original.length;
    const selEnd = el.selectionEnd ?? original.length;
    const { out, map } = wrapWithCursorMap(original, limit);

    if (out !== original) {
      el.value = out;
      const newStart = map[Math.min(selStart, map.length - 1)] ?? out.length;
      const newEnd = map[Math.min(selEnd, map.length - 1)] ?? out.length;
      el.setSelectionRange(newStart, newEnd);
    }
  });
}

export function pad3(n) {
  const s = String(n);
  return s.length >= 3 ? s : (`000${s}`).slice(-3);
}
