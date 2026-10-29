import React, { useState } from 'react';
import { BookOpen, AlertOctagon, Terminal, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Intro Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Guia Didático e Referência Rápida</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          Como funcionam as 4 Operações Básicas no Python
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          No Python, as operações aritméticas são nativas e extremamente diretas. No entanto,
          construir uma calculadora robusta exige atenção a detalhes como conversão de tipos (
          <code className="text-amber-300 font-mono text-xs">float()</code> vs{' '}
          <code className="text-amber-300 font-mono text-xs">int()</code>), tratamento do erro
          de divisão por zero (<code className="text-rose-300 font-mono text-xs">ZeroDivisionError</code>)
          e validação de entrada do usuário.
        </p>
      </div>

      {/* 4 Operações Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adição */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-mono font-bold text-sm">
                +
              </span>
              1. Adição
            </h3>
            <span className="text-xs text-slate-500 font-mono">operador: +</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Soma dois valores numéricos. Funciona tanto com inteiros quanto com números de ponto flutuante.
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 relative group">
            <code>
              <span className="text-rose-400 font-semibold">def</span>{' '}
              <span className="text-sky-300">somar</span>(a: <span className="text-sky-400">float</span>, b:{' '}
              <span className="text-sky-400">float</span>) -&gt; <span className="text-sky-400">float</span>:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400 font-semibold">return</span> a + b
            </code>
          </div>
        </div>

        {/* Subtração */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-sky-950 text-sky-400 border border-sky-800/60 flex items-center justify-center font-mono font-bold text-sm">
                −
              </span>
              2. Subtração
            </h3>
            <span className="text-xs text-slate-500 font-mono">operador: -</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Subtrai o segundo número do primeiro. Suporta resultados negativos normalmente.
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 relative group">
            <code>
              <span className="text-rose-400 font-semibold">def</span>{' '}
              <span className="text-sky-300">subtrair</span>(a: <span className="text-sky-400">float</span>, b:{' '}
              <span className="text-sky-400">float</span>) -&gt; <span className="text-sky-400">float</span>:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400 font-semibold">return</span> a - b
            </code>
          </div>
        </div>

        {/* Multiplicação */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center font-mono font-bold text-sm">
                *
              </span>
              3. Multiplicação
            </h3>
            <span className="text-xs text-slate-500 font-mono">operador: *</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Multiplica dois valores. Em Python, inteiros possuem precisão arbitrária (não estouram 32 ou 64 bits).
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 relative group">
            <code>
              <span className="text-rose-400 font-semibold">def</span>{' '}
              <span className="text-sky-300">multiplicar</span>(a: <span className="text-sky-400">float</span>, b:{' '}
              <span className="text-sky-400">float</span>) -&gt; <span className="text-sky-400">float</span>:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400 font-semibold">return</span> a * b
            </code>
          </div>
        </div>

        {/* Divisão */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-purple-950 text-purple-400 border border-purple-800/60 flex items-center justify-center font-mono font-bold text-sm">
                /
              </span>
              4. Divisão (com proteção /0)
            </h3>
            <span className="text-xs text-slate-500 font-mono">operador: /</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            No Python 3, a barra simples <code className="text-amber-300">/</code> sempre retorna um <code className="text-sky-300">float</code> (ex: <code className="text-slate-300">4 / 2 = 2.0</code>).
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 relative group">
            <code>
              <span className="text-rose-400 font-semibold">def</span>{' '}
              <span className="text-sky-300">dividir</span>(a: <span className="text-sky-400">float</span>, b:{' '}
              <span className="text-sky-400">float</span>):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400 font-semibold">if</span> b == 0:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400 font-semibold">return</span>{' '}
              <span className="text-amber-300">"Erro: Divisão por zero!"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400 font-semibold">return</span> a / b
            </code>
          </div>
        </div>
      </div>

      {/* Zero Division Error Warning */}
      <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-800/40">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-rose-300 text-sm">
              Por que tratar a Divisão por Zero em Python?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Tentar dividir qualquer número por <code className="text-rose-400 font-mono">0</code> lança a exceção{' '}
              <code className="text-rose-400 font-mono">ZeroDivisionError</code> e interrompe o programa imediatamente
              se não for tratada. Existem duas maneiras recomendadas de lidar com isso:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-mono block mb-1 font-semibold">
                  1. Verificação Prévia (LBYL):
                </span>
                <code className="text-slate-300 font-mono text-[11px] block">
                  if b == 0:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Erro"<br />
                  return a / b
                </code>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-sky-400 font-mono block mb-1 font-semibold">
                  2. Captura de Exceção (EAFP):
                </span>
                <code className="text-slate-300 font-mono text-[11px] block">
                  try:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return a / b<br />
                  except ZeroDivisionError:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Erro"
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Como rodar no seu computador */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-base">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span>Como executar o arquivo no seu computador</span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Passo 1 */}
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0 text-xs">
              1
            </span>
            <div className="flex-1">
              <p className="text-slate-200 font-medium mb-1">
                Baixe o código ou salve como <code className="text-amber-300 font-mono">calculadora.py</code>
              </p>
              <p className="text-slate-400">
                Clique no botão "Baixar .py" no gerador de código para salvar o arquivo na sua pasta de preferência (ex: Downloads ou Documentos).
              </p>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0 text-xs">
              2
            </span>
            <div className="flex-1">
              <p className="text-slate-200 font-medium mb-1">Abra o terminal na pasta do arquivo</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-slate-300">
                  <span>
                    <span className="text-slate-500"># No Windows (PowerShell / Prompt):</span>
                    <br />
                    python calculadora.py
                  </span>
                  <button
                    onClick={() => copySnippet('python calculadora.py', 1)}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="Copiar comando"
                  >
                    {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-slate-300">
                  <span>
                    <span className="text-slate-500"># No macOS ou Linux:</span>
                    <br />
                    python3 calculadora.py
                  </span>
                  <button
                    onClick={() => copySnippet('python3 calculadora.py', 2)}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="Copiar comando"
                  >
                    {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0 text-xs">
              3
            </span>
            <div className="flex-1">
              <p className="text-slate-200 font-medium mb-1">Pronto! Interaja pelo console</p>
              <p className="text-slate-400">
                O menu numérico aparecerá no seu terminal. Escolha a operação desejada, digite os valores e visualize o resultado!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
