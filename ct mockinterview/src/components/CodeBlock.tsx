// Simple syntax highlighter for JavaScript / Java snippets — sky-themed, no dependencies.
const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'of', 'in', 'new',
  'class', 'extends', 'super', 'this', 'typeof', 'instanceof', 'try', 'catch', 'finally', 'throw',
  'import', 'export', 'default', 'from', 'async', 'await', 'switch', 'case', 'break', 'continue',
  'do', 'delete', 'void', 'yield', 'static', 'get', 'set',
  // java
  'public', 'private', 'protected', 'int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short',
  'void', 'String', 'System', 'out', 'println', 'print', 'interface', 'implements', 'package', 'final',
  'null', 'true', 'false', 'abstract', 'enum',
]);
const BUILTINS = new Set(['console', 'log', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise', 'parseInt', 'parseFloat', 'isNaN', 'Map', 'Set', 'Date', 'filter', 'map', 'reduce', 'sort', 'substring', 'length', 'push', 'pop', 'slice', 'split', 'join', 'toLowerCase', 'toUpperCase']);

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlight(code: string): string {
  const tokenRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)|(`(?:[^`\\]|\\.)*`|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/gm;
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRegex.exec(code))) {
    out += escapeHtml(code.slice(last, m.index));
    const [full, comment, str, num, word] = m;
    if (comment) out += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
    else if (str) out += `<span class="text-emerald-400">${escapeHtml(str)}</span>`;
    else if (num) out += `<span class="text-amber-300">${escapeHtml(num)}</span>`;
    else if (word) {
      if (KEYWORDS.has(word)) out += `<span class="text-sky-400 font-semibold">${word}</span>`;
      else if (BUILTINS.has(word)) out += `<span class="text-cyan-300">${word}</span>`;
      else out += escapeHtml(word);
    } else out += escapeHtml(full);
    last = m.index + full.length;
  }
  out += escapeHtml(code.slice(last));
  return out;
}
