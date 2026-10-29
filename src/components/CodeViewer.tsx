import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Sparkles } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  filename?: string;
  title?: string;
  badge?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  filename = 'calculadora.py',
  title = 'Código Fonte Python',
  badge = 'Python 3.10+',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Python token highlighting helper
  const highlightPythonLine = (line: string): React.ReactNode => {
    // If entire line is a comment
    const commentIdx = line.indexOf('#');
    if (commentIdx !== -1) {
      // Check if comment is not inside string
      const beforeComment = line.slice(0, commentIdx);
      const quoteCount = (beforeComment.match(/["']/g) || []).length;
      if (quoteCount % 2 === 0) {
        return (
          <>
            {tokenizeLine(beforeComment)}
            <span className="text-emerald-400 italic">{line.slice(commentIdx)}</span>
          </>
        );
      }
    }
    return tokenizeLine(line);
  };

  const tokenizeLine = (text: string): React.ReactNode => {
    // Split into tokens: strings, words, numbers, punctuation
    const regex = /(f"""[\s\S]*?"""|"""[\s\S]*?"""|f"([^"\\]|\\.)*"|f'([^'\\]|\\.)*'|"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\b\d+\.?\d*\b|\b(?:def|class|return|if|elif|else|while|for|in|not|and|or|is|try|except|finally|raise|as|pass|break|continue|import|from|True|False|None|match|case)\b|\b(?:print|input|float|int|str|bool|list|dict|tuple|set|len|round|range|open|eval|super|type|Exception|ZeroDivisionError|ValueError)\b|[+\-*/%=<>!&|^~]+|[(),:.[\]{}])/g;

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const matchStart = match.index;
      if (matchStart > lastIndex) {
        elements.push(text.slice(lastIndex, matchStart));
      }

      const token = match[0];
      const isString =
        token.startsWith('"') ||
        token.startsWith("'") ||
        token.startsWith('f"') ||
        token.startsWith("f'") ||
        token.startsWith('"""');

      if (isString) {
        elements.push(
          <span key={matchStart} className="text-amber-300">
            {token}
          </span>
        );
      } else if (
        /^(def|class|return|if|elif|else|while|for|in|not|and|or|is|try|except|finally|raise|as|pass|break|continue|import|from|True|False|None|match|case)$/.test(
          token
        )
      ) {
        elements.push(
          <span key={matchStart} className="text-rose-400 font-semibold">
            {token}
          </span>
        );
      } else if (
        /^(print|input|float|int|str|bool|list|dict|tuple|set|len|round|range|open|eval|super|type|Exception|ZeroDivisionError|ValueError)$/.test(
          token
        )
      ) {
        elements.push(
          <span key={matchStart} className="text-sky-400">
            {token}
          </span>
        );
      } else if (/^\d+\.?\d*$/.test(token)) {
        elements.push(
          <span key={matchStart} className="text-purple-300">
            {token}
          </span>
        );
      } else if (/^[+\-*/%=<>!]+$/.test(token)) {
        elements.push(
          <span key={matchStart} className="text-cyan-300 font-bold">
            {token}
          </span>
        );
      } else {
        elements.push(<span key={matchStart}>{token}</span>);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>{filename}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{lines.length} linhas</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-mono text-[11px]">{badge}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/70 active:scale-95 cursor-pointer font-medium"
            title="Copiar código Python"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors active:scale-95 cursor-pointer font-medium shadow-sm"
            title="Baixar arquivo .py"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="overflow-x-auto max-h-[580px] p-4 font-mono text-[13px] leading-relaxed text-slate-100 select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                <td className="w-12 pr-4 text-right select-none text-slate-600 font-mono text-xs align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre align-top text-slate-200 font-mono">
                  {line === '' ? ' ' : highlightPythonLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
