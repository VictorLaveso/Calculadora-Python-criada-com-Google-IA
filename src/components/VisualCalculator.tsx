import React, { useState } from 'react';
import { Delete, RotateCcw, Code2, AlertCircle, CheckCircle2, History } from 'lucide-react';

interface CalculationRecord {
  id: string;
  num1: number;
  operator: '+' | '-' | '*' | '/';
  num2: number;
  result: number | 'ZeroDivisionError';
  pythonCall: string;
}

export const VisualCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousVal, setPreviousVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/' | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(true);
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [lastTrace, setLastTrace] = useState<string>(
    '# Nenhuma operação realizada ainda.\n# Pressione os botões para ver o código Python correspondente.'
  );

  const handleNumber = (digit: string) => {
    if (isNewEntry || display === '0' || display === 'Erro') {
      setDisplay(digit);
      setIsNewEntry(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (isNewEntry || display === 'Erro') {
      setDisplay('0.');
      setIsNewEntry(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousVal(null);
    setOperator(null);
    setIsNewEntry(true);
    setLastTrace('# Calculadora limpa (C).\n# estado = {"display": 0, "operador": None}');
  };

  const handleBackspace = () => {
    if (isNewEntry || display === 'Erro') return;
    if (display.length <= 1) {
      setDisplay('0');
      setIsNewEntry(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    if (display === '0' || display === 'Erro') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handleOperator = (op: '+' | '-' | '*' | '/') => {
    const currentNum = parseFloat(display);

    if (previousVal !== null && operator && !isNewEntry) {
      // Execute previous before setting new
      executeCalculation(previousVal, currentNum, operator, op);
    } else {
      setPreviousVal(currentNum);
      setOperator(op);
      setIsNewEntry(true);

      const opName =
        op === '+' ? 'somar' : op === '-' ? 'subtrair' : op === '*' ? 'multiplicar' : 'dividir';

      setLastTrace(
        `# Operação selecionada: ${op}\n` +
        `a = ${currentNum}\n` +
        `operador = "${op}"  # Aguardando segundo operando (b) para invocar ${opName}(a, b)`
      );
    }
  };

  const executeCalculation = (
    n1: number,
    n2: number,
    op: '+' | '-' | '*' | '/',
    nextOp?: '+' | '-' | '*' | '/'
  ) => {
    performExecution(n1, n2, op, nextOp);
  };

  const handleEquals = () => {
    if (previousVal === null || operator === null) return;
    const currentNum = parseFloat(display);
    performExecution(previousVal, currentNum, operator);
  };

  const performExecution = (
    n1: number,
    n2: number,
    op: '+' | '-' | '*' | '/',
    nextOp: '+' | '-' | '*' | '/' | null = null
  ) => {
    let result: number | 'ZeroDivisionError';
    let pythonCode = '';
    let funcName = '';

    if (op === '+') {
      funcName = 'somar';
      result = n1 + n2;
      pythonCode =
        `# Função executada:\n` +
        `def somar(a: float, b: float) -> float:\n` +
        `    return a + b\n\n` +
        `# Chamada:\n` +
        `resultado = somar(${n1}, ${n2})\n` +
        `print(f"{resultado = }")  # >>> ${result}`;
    } else if (op === '-') {
      funcName = 'subtrair';
      result = n1 - n2;
      pythonCode =
        `# Função executada:\n` +
        `def subtrair(a: float, b: float) -> float:\n` +
        `    return a - b\n\n` +
        `# Chamada:\n` +
        `resultado = subtrair(${n1}, ${n2})\n` +
        `print(f"{resultado = }")  # >>> ${result}`;
    } else if (op === '*') {
      funcName = 'multiplicar';
      result = n1 * n2;
      pythonCode =
        `# Função executada:\n` +
        `def multiplicar(a: float, b: float) -> float:\n` +
        `    return a * b\n\n` +
        `# Chamada:\n` +
        `resultado = multiplicar(${n1}, ${n2})\n` +
        `print(f"{resultado = }")  # >>> ${result}`;
    } else {
      funcName = 'dividir';
      if (n2 === 0) {
        result = 'ZeroDivisionError';
        pythonCode =
          `# Função executada:\n` +
          `def dividir(a: float, b: float):\n` +
          `    if b == 0:\n` +
          `        raise ZeroDivisionError("Divisão por zero!")\n` +
          `    return a / b\n\n` +
          `# Chamada capturada:\n` +
          `try:\n` +
          `    resultado = dividir(${n1}, 0)\n` +
          `except ZeroDivisionError as erro:\n` +
          `    print(f"Erro capturado: {erro}")  # ZeroDivisionError!`;
      } else {
        result = n1 / n2;
        // Trim decimals if too long
        if (result.toString().length > 12) {
          result = parseFloat(result.toFixed(8));
        }
        pythonCode =
          `# Função executada:\n` +
          `def dividir(a: float, b: float) -> float:\n` +
          `    if b == 0:\n` +
          `        raise ZeroDivisionError("Divisão por zero!")\n` +
          `    return a / b\n\n` +
          `# Chamada:\n` +
          `resultado = dividir(${n1}, ${n2})\n` +
          `print(f"{resultado = }")  # >>> ${result}`;
      }
    }

    setLastTrace(pythonCode);

    const record: CalculationRecord = {
      id: Date.now().toString(),
      num1: n1,
      operator: op,
      num2: n2,
      result: result,
      pythonCall: `${funcName}(${n1}, ${n2})`,
    };

    setRecords((prev) => [record, ...prev.slice(0, 19)]);

    if (result === 'ZeroDivisionError') {
      setDisplay('Erro: /0');
      setPreviousVal(null);
      setOperator(null);
      setIsNewEntry(true);
    } else {
      setDisplay(result.toString());
      if (nextOp) {
        setPreviousVal(result);
        setOperator(nextOp);
      } else {
        setPreviousVal(null);
        setOperator(null);
      }
      setIsNewEntry(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Coluna 1: Calculadora Visual (5 cols) */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full max-w-[360px] bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          {/* Subtle glow header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500" />

          {/* Top Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span className="font-mono text-[11px] tracking-wide text-slate-400">
              PYTHON DISPATCHER
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono text-[11px]">Online</span>
            </div>
          </div>

          {/* Display */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-5 text-right min-h-[90px] flex flex-col justify-between">
            <div className="text-slate-400 text-xs font-mono h-5 overflow-hidden text-ellipsis">
              {previousVal !== null && operator !== null ? (
                <span>
                  {previousVal} {operator} {isNewEntry ? '' : display}
                </span>
              ) : (
                <span className="text-slate-600 font-mono">Python Interpreter Ready</span>
              )}
            </div>
            <div
              className={`font-mono font-bold tracking-tight overflow-x-auto select-all ${
                display.startsWith('Erro')
                  ? 'text-rose-400 text-2xl'
                  : display.length > 9
                  ? 'text-2xl text-slate-100'
                  : 'text-4xl text-slate-100'
              }`}
            >
              {display}
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Linha 1 */}
            <button
              onClick={handleClear}
              className="h-14 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-lg transition-colors border border-rose-800/50 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Limpar (Clear)"
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-lg transition-colors border border-slate-700/60 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Apagar dígito (Backspace)"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              onClick={handleToggleSign}
              className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-lg transition-colors border border-slate-700/60 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Trocar Sinal (+/-)"
            >
              ±
            </button>
            <button
              onClick={() => handleOperator('/')}
              className={`h-14 rounded-xl font-bold text-xl transition-all border active:scale-95 cursor-pointer flex items-center justify-center ${
                operator === '/'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-600/90 hover:bg-amber-500 text-white border-amber-500/50'
              }`}
              title="Divisão: a / b"
            >
              ÷
            </button>

            {/* Linha 2 */}
            <button
              onClick={() => handleNumber('7')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              7
            </button>
            <button
              onClick={() => handleNumber('8')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              8
            </button>
            <button
              onClick={() => handleNumber('9')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              9
            </button>
            <button
              onClick={() => handleOperator('*')}
              className={`h-14 rounded-xl font-bold text-xl transition-all border active:scale-95 cursor-pointer flex items-center justify-center ${
                operator === '*'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-600/90 hover:bg-amber-500 text-white border-amber-500/50'
              }`}
              title="Multiplicação: a * b"
            >
              ×
            </button>

            {/* Linha 3 */}
            <button
              onClick={() => handleNumber('4')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              4
            </button>
            <button
              onClick={() => handleNumber('5')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              5
            </button>
            <button
              onClick={() => handleNumber('6')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              6
            </button>
            <button
              onClick={() => handleOperator('-')}
              className={`h-14 rounded-xl font-bold text-2xl transition-all border active:scale-95 cursor-pointer flex items-center justify-center ${
                operator === '-'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-600/90 hover:bg-amber-500 text-white border-amber-500/50'
              }`}
              title="Subtração: a - b"
            >
              −
            </button>

            {/* Linha 4 */}
            <button
              onClick={() => handleNumber('1')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              1
            </button>
            <button
              onClick={() => handleNumber('2')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              2
            </button>
            <button
              onClick={() => handleNumber('3')}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer"
            >
              3
            </button>
            <button
              onClick={() => handleOperator('+')}
              className={`h-14 rounded-xl font-bold text-2xl transition-all border active:scale-95 cursor-pointer flex items-center justify-center ${
                operator === '+'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-600/90 hover:bg-amber-500 text-white border-amber-500/50'
              }`}
              title="Adição: a + b"
            >
              +
            </button>

            {/* Linha 5 */}
            <button
              onClick={() => handleNumber('0')}
              className="col-span-2 h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer flex items-center pl-6"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="h-14 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-bold text-xl transition-colors border border-slate-700/40 active:scale-95 cursor-pointer flex items-center justify-center"
            >
              ,
            </button>
            <button
              onClick={handleEquals}
              className="h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xl transition-all border border-emerald-500/60 shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Calcular resultado (=)"
            >
              =
            </button>
          </div>
        </div>
      </div>

      {/* Coluna 2: Trace de Execução Python em Tempo Real (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Painel do Trace */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-slate-200 text-sm">
                Trace de Execução Python em Tempo Real
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              eval / function call
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto min-h-[160px] whitespace-pre">
            {lastTrace}
          </div>
        </div>

        {/* Histórico de chamadas efetuadas */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              <h4 className="font-semibold text-slate-200 text-sm">
                Histórico de Operações (Python list)
              </h4>
            </div>
            {records.length > 0 && (
              <button
                onClick={() => setRecords([])}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono cursor-pointer"
              >
                Limpar lista
              </button>
            )}
          </div>

          {records.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs font-mono">
              Nenhuma operação no histórico ainda. Calcule algo na calculadora!
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {records.map((r) => {
                const isErr = r.result === 'ZeroDivisionError';
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800/60 font-mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {isErr ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span className="text-slate-300">
                        {r.num1} {r.operator} {r.num2}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[11px]">{r.pythonCall}</span>
                      <span
                        className={`font-bold ${
                          isErr ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        = {r.result}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
