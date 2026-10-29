import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, RotateCcw, Play, Zap, AlertTriangle } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'system' | 'prompt' | 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const PythonTerminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: '$ python3 calculadora.py',
    },
    {
      id: 'init-2',
      type: 'output',
      text: '===================================',
    },
    {
      id: 'init-3',
      type: 'output',
      text: '   CALCULADORA PYTHON - 4 OPERAÇÕES',
    },
    {
      id: 'init-4',
      type: 'output',
      text: '===================================',
    },
    {
      id: 'init-5',
      type: 'output',
      text: '1. Adição (+)\n2. Subtração (-)\n3. Multiplicação (*)\n4. Divisão (/)\n5. Ver Histórico de Cálculos\n0. Sair\n===================================',
    },
    {
      id: 'init-6',
      type: 'prompt',
      text: 'Escolha uma opção (0-5): ',
    },
  ]);

  // Terminal state machine
  // step: 'menu' | 'num1' | 'num2' | 'exited'
  const [step, setStep] = useState<'menu' | 'num1' | 'num2' | 'exited'>('menu');
  const [selectedOp, setSelectedOp] = useState<'1' | '2' | '3' | '4' | null>(null);
  const [firstNum, setFirstNum] = useState<number | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleReset = () => {
    setHistory([]);
    setStep('menu');
    setSelectedOp(null);
    setFirstNum(null);
    setCurrentInput('');
    setLines([
      { id: Date.now() + '-1', type: 'system', text: '$ python3 calculadora.py' },
      { id: Date.now() + '-2', type: 'output', text: '===================================' },
      { id: Date.now() + '-3', type: 'output', text: '   CALCULADORA PYTHON - 4 OPERAÇÕES' },
      { id: Date.now() + '-4', type: 'output', text: '===================================' },
      {
        id: Date.now() + '-5',
        type: 'output',
        text: '1. Adição (+)\n2. Subtração (-)\n3. Multiplicação (*)\n4. Divisão (/)\n5. Ver Histórico de Cálculos\n0. Sair\n===================================',
      },
      { id: Date.now() + '-6', type: 'prompt', text: 'Escolha uma opção (0-5): ' },
    ]);
  };

  const showMenuLines = () => [
    { id: Date.now() + '-m1', type: 'output', text: '\n===================================' },
    { id: Date.now() + '-m2', type: 'output', text: '   CALCULADORA PYTHON - 4 OPERAÇÕES' },
    { id: Date.now() + '-m3', type: 'output', text: '===================================' },
    {
      id: Date.now() + '-m4',
      type: 'output',
      text: '1. Adição (+)\n2. Subtração (-)\n3. Multiplicação (*)\n4. Divisão (/)\n5. Ver Histórico de Cálculos\n0. Sair\n===================================',
    },
    { id: Date.now() + '-m5', type: 'prompt', text: 'Escolha uma opção (0-5): ' },
  ] as TerminalLine[];

  const processInput = (text: string) => {
    const trimmed = text.trim();

    if (step === 'exited') {
      setLines((prev) => [
        ...prev,
        { id: Date.now() + '-in', type: 'input', text: trimmed },
        { id: Date.now() + '-err', type: 'error', text: 'O programa já foi finalizado. Clique em "Reiniciar" para executar novamente.' },
      ]);
      setCurrentInput('');
      return;
    }

    if (step === 'menu') {
      if (trimmed === '0') {
        setStep('exited');
        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-in', type: 'input', text: trimmed },
          { id: Date.now() + '-out', type: 'system', text: '\nEncerrando a calculadora. Até logo!' },
          { id: Date.now() + '-end', type: 'system', text: 'Process finished with exit code 0' },
        ]);
        setCurrentInput('');
        return;
      }

      if (trimmed === '5') {
        let historyOutput = '\n--- HISTÓRICO DE CÁLCULOS ---';
        if (history.length === 0) {
          historyOutput += '\nNenhum cálculo realizado ainda.';
        } else {
          history.forEach((h) => {
            historyOutput += `\n${h}`;
          });
        }
        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-in', type: 'input', text: trimmed },
          { id: Date.now() + '-h', type: 'output', text: historyOutput },
          ...showMenuLines(),
        ]);
        setCurrentInput('');
        return;
      }

      if (['1', '2', '3', '4'].includes(trimmed)) {
        setSelectedOp(trimmed as '1' | '2' | '3' | '4');
        setStep('num1');
        const opName =
          trimmed === '1'
            ? 'Adição (+)'
            : trimmed === '2'
            ? 'Subtração (-)'
            : trimmed === '3'
            ? 'Multiplicação (*)'
            : 'Divisão (/)';

        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-in', type: 'input', text: trimmed },
          { id: Date.now() + '-sel', type: 'system', text: `[Selecionado: ${opName}]` },
          { id: Date.now() + '-prompt1', type: 'prompt', text: 'Digite o primeiro número: ' },
        ]);
        setCurrentInput('');
        return;
      }

      // Invalid option
      setLines((prev) => [
        ...prev,
        { id: Date.now() + '-in', type: 'input', text: trimmed },
        { id: Date.now() + '-inv', type: 'error', text: 'Opção inválida! Escolha um número válido (0 a 5).' },
        { id: Date.now() + '-p', type: 'prompt', text: 'Escolha uma opção (0-5): ' },
      ]);
      setCurrentInput('');
      return;
    }

    if (step === 'num1') {
      const val = parseFloat(trimmed.replace(',', '.'));
      if (isNaN(val)) {
        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-in', type: 'input', text: trimmed },
          { id: Date.now() + '-err', type: 'error', text: 'ValueError: could not convert string to float. Digite apenas números!' },
          { id: Date.now() + '-retry1', type: 'prompt', text: 'Digite o primeiro número: ' },
        ]);
        setCurrentInput('');
        return;
      }

      setFirstNum(val);
      setStep('num2');
      setLines((prev) => [
        ...prev,
        { id: Date.now() + '-in', type: 'input', text: trimmed },
        { id: Date.now() + '-prompt2', type: 'prompt', text: 'Digite o segundo número: ' },
      ]);
      setCurrentInput('');
      return;
    }

    if (step === 'num2') {
      const val2 = parseFloat(trimmed.replace(',', '.'));
      if (isNaN(val2)) {
        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-in', type: 'input', text: trimmed },
          { id: Date.now() + '-err', type: 'error', text: 'ValueError: could not convert string to float. Digite apenas números!' },
          { id: Date.now() + '-retry2', type: 'prompt', text: 'Digite o segundo número: ' },
        ]);
        setCurrentInput('');
        return;
      }

      const n1 = firstNum!;
      const n2 = val2;
      let resultStr = '';
      let recordStr = '';
      let isZeroDiv = false;

      if (selectedOp === '1') {
        const res = n1 + n2;
        resultStr = `>>> RESULTADO: ${n1} + ${n2} = ${res}`;
        recordStr = `${n1} + ${n2} = ${res}`;
      } else if (selectedOp === '2') {
        const res = n1 - n2;
        resultStr = `>>> RESULTADO: ${n1} - ${n2} = ${res}`;
        recordStr = `${n1} - ${n2} = ${res}`;
      } else if (selectedOp === '3') {
        const res = n1 * n2;
        resultStr = `>>> RESULTADO: ${n1} * ${n2} = ${res}`;
        recordStr = `${n1} * ${n2} = ${res}`;
      } else if (selectedOp === '4') {
        if (n2 === 0) {
          isZeroDiv = true;
          resultStr = `>>> ZeroDivisionError: Erro: Divisão por zero não é permitida!`;
          recordStr = `${n1} / 0 = [ERRO: Divisão por Zero]`;
        } else {
          const res = n1 / n2;
          resultStr = `>>> RESULTADO: ${n1} / ${n2} = ${res}`;
          recordStr = `${n1} / ${n2} = ${res}`;
        }
      }

      setHistory((prev) => [...prev, recordStr]);
      setStep('menu');
      setSelectedOp(null);
      setFirstNum(null);

      setLines((prev) => [
        ...prev,
        { id: Date.now() + '-in', type: 'input', text: trimmed },
        {
          id: Date.now() + '-res',
          type: isZeroDiv ? 'error' : 'success',
          text: resultStr,
        },
        ...showMenuLines(),
      ]);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processInput(currentInput);
    }
  };

  const runQuickTest = (scenario: 'soma' | 'divZero' | 'multDec') => {
    handleReset();
    setTimeout(() => {
      if (scenario === 'soma') {
        // Opção 1, 15, 27
        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-q1', type: 'input', text: '1' },
          { id: Date.now() + '-q2', type: 'system', text: '[Selecionado: Adição (+)]' },
          { id: Date.now() + '-q3', type: 'prompt', text: 'Digite o primeiro número: 15' },
          { id: Date.now() + '-q4', type: 'prompt', text: 'Digite o segundo número: 27' },
          { id: Date.now() + '-q5', type: 'success', text: '>>> RESULTADO: 15 + 27 = 42' },
          ...showMenuLines(),
        ]);
        setHistory(['15 + 27 = 42']);
      } else if (scenario === 'divZero') {
        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-q1', type: 'input', text: '4' },
          { id: Date.now() + '-q2', type: 'system', text: '[Selecionado: Divisão (/)]' },
          { id: Date.now() + '-q3', type: 'prompt', text: 'Digite o primeiro número: 10' },
          { id: Date.now() + '-q4', type: 'prompt', text: 'Digite o segundo número: 0' },
          { id: Date.now() + '-q5', type: 'error', text: '>>> ZeroDivisionError: Erro: Divisão por zero não é permitida!' },
          ...showMenuLines(),
        ]);
        setHistory(['10 / 0 = [ERRO: Divisão por Zero]']);
      } else if (scenario === 'multDec') {
        setLines((prev) => [
          ...prev,
          { id: Date.now() + '-q1', type: 'input', text: '3' },
          { id: Date.now() + '-q2', type: 'system', text: '[Selecionado: Multiplicação (*)]' },
          { id: Date.now() + '-q3', type: 'prompt', text: 'Digite o primeiro número: 3.14159' },
          { id: Date.now() + '-q4', type: 'prompt', text: 'Digite o segundo número: 2' },
          { id: Date.now() + '-q5', type: 'success', text: '>>> RESULTADO: 3.14159 * 2 = 6.28318' },
          ...showMenuLines(),
        ]);
        setHistory(['3.14159 * 2 = 6.28318']);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span>bash / python3 terminal interativo</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400">interativo</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700 cursor-pointer active:scale-95"
            title="Reiniciar execução do script"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reiniciar (Ctrl+C)</span>
          </button>
        </div>
      </div>

      {/* Quick Scenarios Helper Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Testes Rápidos:
        </span>
        <button
          onClick={() => runQuickTest('soma')}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors border border-slate-700/60 cursor-pointer"
        >
          Adição: 15 + 27
        </button>
        <button
          onClick={() => runQuickTest('divZero')}
          className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 font-mono transition-colors border border-rose-800/60 cursor-pointer"
        >
          Divisão por Zero: 10 / 0
        </button>
        <button
          onClick={() => runQuickTest('multDec')}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors border border-slate-700/60 cursor-pointer"
        >
          Multiplicação: 3.14159 * 2
        </button>
      </div>

      {/* Terminal Output Area */}
      <div
        className="p-4 font-mono text-sm leading-relaxed text-slate-200 min-h-[380px] max-h-[500px] overflow-y-auto cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => {
          if (line.type === 'system') {
            return (
              <div key={line.id} className="text-slate-500 font-medium whitespace-pre-wrap">
                {line.text}
              </div>
            );
          }
          if (line.type === 'error') {
            return (
              <div key={line.id} className="text-rose-400 font-medium whitespace-pre-wrap flex items-start gap-1.5 my-1">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{line.text}</span>
              </div>
            );
          }
          if (line.type === 'success') {
            return (
              <div key={line.id} className="text-emerald-400 font-bold whitespace-pre-wrap my-1 bg-emerald-950/20 px-2 py-1 rounded border border-emerald-800/30">
                {line.text}
              </div>
            );
          }
          if (line.type === 'input') {
            return (
              <div key={line.id} className="text-amber-300 font-semibold">
                &gt; {line.text}
              </div>
            );
          }
          if (line.type === 'prompt') {
            return (
              <div key={line.id} className="text-sky-300 font-medium">
                {line.text}
              </div>
            );
          }
          return (
            <div key={line.id} className="text-slate-300 whitespace-pre-wrap">
              {line.text}
            </div>
          );
        })}

        {/* Active input line */}
        {step !== 'exited' ? (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-emerald-400 font-bold select-none">&gt;&gt;&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                step === 'menu'
                  ? 'Digite 1, 2, 3, 4, 5 ou 0...'
                  : step === 'num1'
                  ? 'Ex: 10, 42.5...'
                  : 'Ex: 5, 2.5...'
              }
              className="flex-1 bg-transparent border-none outline-none text-amber-300 font-mono text-sm placeholder:text-slate-600 focus:ring-0"
              autoFocus
            />
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 text-xs font-mono">Terminal finalizado.</span>
            <button
              onClick={handleReset}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-mono underline cursor-pointer"
            >
              Executar novamente (python3 calculadora.py)
            </button>
          </div>
        )}

        <div ref={terminalBottomRef} />
      </div>

      {/* Terminal Footer status */}
      <div className="px-4 py-2 bg-[#161b22] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Python 3.10 Interpreter</span>
        </div>
        <div className="text-slate-500">
          Pressione <span className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">Enter</span> para enviar
        </div>
      </div>
    </div>
  );
};
