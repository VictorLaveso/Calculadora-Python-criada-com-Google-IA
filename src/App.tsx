import React, { useState } from 'react';
import {
  Code2,
  Terminal as TerminalIcon,
  Calculator,
  BookOpen,
  Download,
  Copy,
  Check,
  Sliders,
  Settings2,
  Play,
  Sparkles,
} from 'lucide-react';
import { CodeViewer } from './components/CodeViewer';
import { PythonTerminal } from './components/PythonTerminal';
import { VisualCalculator } from './components/VisualCalculator';
import { EducationalGuide } from './components/EducationalGuide';
import {
  GeneratorConfig,
  defaultGeneratorConfig,
  generatePythonCLI,
  generatePythonOOP,
  generatePythonMatchCase,
  generatePythonTkinter,
} from './data/pythonTemplates';

type TabType = 'code' | 'terminal' | 'visual' | 'guide';
type TemplateType = 'cli' | 'oop' | 'match' | 'tkinter';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('code');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('cli');
  const [config, setConfig] = useState<GeneratorConfig>(defaultGeneratorConfig);
  const [copiedQuick, setCopiedQuick] = useState(false);

  // Compute active Python code based on template & config
  const getActiveCode = (): string => {
    switch (selectedTemplate) {
      case 'cli':
        return generatePythonCLI(config);
      case 'oop':
        return generatePythonOOP(config);
      case 'match':
        return generatePythonMatchCase();
      case 'tkinter':
        return generatePythonTkinter();
      default:
        return generatePythonCLI(config);
    }
  };

  const activeCode = getActiveCode();

  const handleQuickCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    } catch {
      // Fallback
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    }
  };

  const handleDownload = () => {
    const filename =
      selectedTemplate === 'tkinter'
        ? 'calculadora_gui.py'
        : selectedTemplate === 'oop'
        ? 'calculadora_poo.py'
        : 'calculadora.py';
    const blob = new Blob([activeCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0d111b]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Python Custom Styled Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 via-slate-800 to-amber-500/20 border border-slate-700 flex items-center justify-center p-2 shadow-sm">
              <span className="font-mono font-bold text-sm bg-gradient-to-r from-sky-400 to-amber-300 bg-clip-text text-transparent">
                Py
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">
                  Calculadora em Python
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  4 Operações Básicas
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Adição (+), Subtração (−), Multiplicação (×) e Divisão (÷)
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              {copiedQuick ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline">Copiar Código</span>
                  <span className="md:hidden">Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .py</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 -mb-px overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'code'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Gerador de Código Python</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'terminal'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <TerminalIcon className="w-4 h-4" />
              <span>Terminal Interativo (CLI)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>

            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'visual'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Calculadora Visual & Trace</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guia Didático & Como Rodar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: CODE GENERATOR */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            {/* Template Selector Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Escolha o Estilo de Código:
                </span>
              </div>

              {/* Segmented Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800/80">
                <button
                  onClick={() => setSelectedTemplate('cli')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    selectedTemplate === 'cli'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  CLI Interativo (Padrão)
                </button>
                <button
                  onClick={() => setSelectedTemplate('oop')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    selectedTemplate === 'oop'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Orientada a Objetos (POO)
                </button>
                <button
                  onClick={() => setSelectedTemplate('match')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    selectedTemplate === 'match'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Funcional (Python 3.10+)
                </button>
                <button
                  onClick={() => setSelectedTemplate('tkinter')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    selectedTemplate === 'tkinter'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Desktop GUI (Tkinter)
                </button>
              </div>
            </div>

            {/* Customization Options (if CLI or OOP is selected) */}
            {(selectedTemplate === 'cli' || selectedTemplate === 'oop') && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300 font-mono">
                  <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                  Parâmetros de Geração:
                </span>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.includeTypeHints}
                    onChange={(e) =>
                      setConfig({ ...config, includeTypeHints: e.target.checked })
                    }
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Type Hints (a: float, b: float)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.includeDocstrings}
                    onChange={(e) =>
                      setConfig({ ...config, includeDocstrings: e.target.checked })
                    }
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Docstrings explicativas (PEP 257)</span>
                </label>

                {selectedTemplate === 'cli' && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.includeHistory}
                      onChange={(e) =>
                        setConfig({ ...config, includeHistory: e.target.checked })
                      }
                      className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Opção de Histórico no Menu</span>
                  </label>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Proteção /0:</span>
                  <select
                    value={config.handleZeroDivision}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        handleZeroDivision: e.target.value as 'conditional' | 'exception',
                      })
                    }
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none text-xs cursor-pointer"
                  >
                    <option value="conditional">if b == 0: (Condicional)</option>
                    <option value="exception">try / except ZeroDivisionError</option>
                  </select>
                </div>
              </div>
            )}

            {/* Code Viewer */}
            <CodeViewer
              code={activeCode}
              filename={
                selectedTemplate === 'tkinter'
                  ? 'calculadora_gui.py'
                  : selectedTemplate === 'oop'
                  ? 'calculadora_poo.py'
                  : 'calculadora.py'
              }
              badge={
                selectedTemplate === 'tkinter'
                  ? 'Tkinter GUI'
                  : selectedTemplate === 'oop'
                  ? 'POO / Classes'
                  : selectedTemplate === 'match'
                  ? 'Match/Case 3.10+'
                  : 'CLI / Terminal'
              }
            />

            {/* Quick feature overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold text-sm mb-1">+ Adição</div>
                <p className="text-slate-400 text-xs">
                  Soma <code className="text-slate-300 font-mono">a + b</code> com suporte automático para inteiros e decimais (float).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-sky-400 font-mono font-bold text-sm mb-1">− Subtração</div>
                <p className="text-slate-400 text-xs">
                  Diferença <code className="text-slate-300 font-mono">a - b</code> com cálculo exato e números negativos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-amber-400 font-mono font-bold text-sm mb-1">× Multiplicação</div>
                <p className="text-slate-400 text-xs">
                  Produto <code className="text-slate-300 font-mono">a * b</code> sem limite arbitrário de tamanho de inteiros.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-purple-400 font-mono font-bold text-sm mb-1">÷ Divisão</div>
                <p className="text-slate-400 text-xs">
                  Quociente real <code className="text-slate-300 font-mono">a / b</code> com validação contra <code className="text-rose-400 font-mono">ZeroDivisionError</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-emerald-400" />
                  Terminal Python Interativo
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Experimente o script <code className="text-amber-300 font-mono">calculadora.py</code> diretamente aqui no navegador!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('code')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
                >
                  Ver código Python
                </button>
              </div>
            </div>

            <PythonTerminal />
          </div>
        )}

        {/* TAB 3: VISUAL CALCULATOR & TRACE */}
        {activeTab === 'visual' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Calculadora Visual com Sincronização Python
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Utilize o teclado da calculadora abaixo para realizar qualquer uma das 4 operações e observe em tempo real o código Python e o tratamento de exceções gerados.
              </p>
            </div>

            <VisualCalculator />
          </div>
        )}

        {/* TAB 4: EDUCATIONAL GUIDE */}
        {activeTab === 'guide' && <EducationalGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d111b] py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-400 font-semibold">Python 3</span>
            <span>·</span>
            <span>4 Operações Básicas: Adição, Subtração, Multiplicação e Divisão</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Execute localmente com <span className="text-amber-300">python calculadora.py</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
