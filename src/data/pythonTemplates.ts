export interface GeneratorConfig {
  includeTypeHints: boolean;
  includeDocstrings: boolean;
  handleZeroDivision: 'exception' | 'conditional';
  useFloats: boolean;
  includeHistory: boolean;
  roundDecimals: number;
}

export const defaultGeneratorConfig: GeneratorConfig = {
  includeTypeHints: true,
  includeDocstrings: true,
  handleZeroDivision: 'conditional',
  useFloats: true,
  includeHistory: true,
  roundDecimals: 4,
};

export function generatePythonCLI(config: GeneratorConfig): string {
  const numType = config.useFloats ? 'float' : 'float';
  const inputCast = config.useFloats ? 'float' : 'int';
  const typeA = config.includeTypeHints ? `a: ${numType}, b: ${numType}` : 'a, b';
  const returnTypeFloat = config.includeTypeHints ? ' -> float' : '';
  const returnTypeDiv = config.includeTypeHints ? ' -> float | str' : '';

  let code = `"""
Calculadora em Python - As 4 Operações Básicas
Autor: Desenvolvido com carinho para aprendizado e prática
Operações: Adição (+), Subtração (-), Multiplicação (*) e Divisão (/)
"""

`;

  // Somar
  code += `def somar(${typeA})${returnTypeFloat}:\n`;
  if (config.includeDocstrings) {
    code += `    """Retorna a soma de dois números (a + b)."""\n`;
  }
  code += `    return a + b\n\n`;

  // Subtrair
  code += `def subtrair(${typeA})${returnTypeFloat}:\n`;
  if (config.includeDocstrings) {
    code += `    """Retorna a diferença entre dois números (a - b)."""\n`;
  }
  code += `    return a - b\n\n`;

  // Multiplicar
  code += `def multiplicar(${typeA})${returnTypeFloat}:\n`;
  if (config.includeDocstrings) {
    code += `    """Retorna o produto de dois números (a * b)."""\n`;
  }
  code += `    return a * b\n\n`;

  // Dividir
  code += `def dividir(${typeA})${returnTypeDiv}:\n`;
  if (config.includeDocstrings) {
    code += `    """Retorna o quociente da divisão (a / b) com proteção contra divisão por zero."""\n`;
  }
  if (config.handleZeroDivision === 'conditional') {
    code += `    if b == 0:\n`;
    code += `        return "Erro: Divisão por zero não é permitida!"\n`;
    code += `    return a / b\n\n`;
  } else {
    code += `    try:\n`;
    code += `        return a / b\n`;
    code += `    except ZeroDivisionError:\n`;
    code += `        return "Erro: Não é possível dividir um número por zero!"\n\n`;
  }

  // Menu principal e loop
  code += `def exibir_menu():\n`;
  code += `    print("\\n" + "=" * 35)\n`;
  code += `    print("   CALCULADORA PYTHON - 4 OPERAÇÕES")\n`;
  code += `    print("=" * 35)\n`;
  code += `    print("1. Adição (+)")\n`;
  code += `    print("2. Subtração (-)")\n`;
  code += `    print("3. Multiplicação (*)")\n`;
  code += `    print("4. Divisão (/)")\n`;
  if (config.includeHistory) {
    code += `    print("5. Ver Histórico de Cálculos")\n`;
  }
  code += `    print("0. Sair")\n`;
  code += `    print("=" * 35)\n\n`;

  code += `def main():\n`;
  if (config.includeHistory) {
    code += `    historico = []\n`;
  }
  code += `    while True:\n`;
  code += `        exibir_menu()\n`;
  code += `        opcao = input("Escolha uma opção (0-${config.includeHistory ? '5' : '4'}): ").strip()\n\n`;
  code += `        if opcao == "0":\n`;
  code += `            print("\\nEncerrando a calculadora. Até logo!")\n`;
  code += `            break\n\n`;

  if (config.includeHistory) {
    code += `        if opcao == "5":\n`;
    code += `            print("\\n--- HISTÓRICO DE CÁLCULOS ---")\n`;
    code += `            if not historico:\n`;
    code += `                print("Nenhum cálculo realizado ainda.")\n`;
    code += `            else:\n`;
    code += `                for item in historico:\n`;
    code += `                    print(item)\n`;
    code += `            continue\n\n`;
  }

  code += `        if opcao not in ["1", "2", "3", "4"]:\n`;
  code += `            print("Opção inválida! Escolha um número válido.")\n`;
  code += `            continue\n\n`;

  code += `        try:\n`;
  code += `            num1 = ${inputCast}(input("Digite o primeiro número: "))\n`;
  code += `            num2 = ${inputCast}(input("Digite o segundo número: "))\n`;
  code += `        except ValueError:\n`;
  code += `            print("Erro: Por favor, digite apenas números válidos!")\n`;
  code += `            continue\n\n`;

  code += `        if opcao == "1":\n`;
  code += `            resultado = somar(num1, num2)\n`;
  code += `            operacao = f"{num1} + {num2} = {resultado}"\n`;
  code += `        elif opcao == "2":\n`;
  code += `            resultado = subtrair(num1, num2)\n`;
  code += `            operacao = f"{num1} - {num2} = {resultado}"\n`;
  code += `        elif opcao == "3":\n`;
  code += `            resultado = multiplicar(num1, num2)\n`;
  code += `            operacao = f"{num1} * {num2} = {resultado}"\n`;
  code += `        elif opcao == "4":\n`;
  code += `            resultado = dividir(num1, num2)\n`;
  code += `            operacao = f"{num1} / {num2} = {resultado}"\n\n`;

  code += `        print(f"\\n>>> RESULTADO: {operacao}")\n`;
  if (config.includeHistory) {
    code += `        historico.append(operacao)\n`;
  }

  code += `\nif __name__ == "__main__":\n`;
  code += `    main()\n`;

  return code;
}

export function generatePythonOOP(config: GeneratorConfig): string {
  const typeA = config.includeTypeHints ? 'a: float, b: float' : 'a, b';
  const retFloat = config.includeTypeHints ? ' -> float' : '';
  const retDiv = config.includeTypeHints ? ' -> float' : '';

  return `"""
Calculadora Orientada a Objetos (POO) em Python
Com as 4 operações básicas e histórico encapsulado.
"""

class DivisaoPorZeroError(Exception):
    """Exceção levantada quando ocorre tentativa de divisão por zero."""
    pass


class Calculadora:
    """Representa uma calculadora com as quatro operações aritméticas básicas."""

    def __init__(self):
        self._historico: list[str] = []

    def somar(self, ${typeA})${retFloat}:
        """Realiza a adição de dois números."""
        resultado = a + b
        self._registrar(f"{a} + {b} = {resultado}")
        return resultado

    def subtrair(self, ${typeA})${retFloat}:
        """Realiza a subtração de dois números."""
        resultado = a - b
        self._registrar(f"{a} - {b} = {resultado}")
        return resultado

    def multiplicar(self, ${typeA})${retFloat}:
        """Realiza a multiplicação de dois números."""
        resultado = a * b
        self._registrar(f"{a} * {b} = {resultado}")
        return resultado

    def dividir(self, ${typeA})${retDiv}:
        """Realiza a divisão de dois números, validando denominador zero."""
        if b == 0:
            raise DivisaoPorZeroError("Denominador não pode ser zero.")
        resultado = a / b
        self._registrar(f"{a} / {b} = {resultado}")
        return resultado

    def _registrar(self, operacao: str) -> None:
        """Registra a operação no histórico interno."""
        self._historico.append(operacao)

    @property
    def historico(self) -> list[str]:
        """Retorna uma cópia da lista de cálculos efetuados."""
        return list(self._historico)


# Exemplo de uso prático:
if __name__ == "__main__":
    calc = Calculadora()

    print("--- Testando Métodos da Calculadora ---")
    print("Soma (10 + 5):", calc.somar(10, 5))
    print("Subtração (10 - 5):", calc.subtrair(10, 5))
    print("Multiplicação (10 * 5):", calc.multiplicar(10, 5))
    print("Divisão (10 / 5):", calc.dividir(10, 5))

    # Testando tratamento de erro
    try:
        calc.dividir(10, 0)
    except DivisaoPorZeroError as erro:
        print("Tratamento de erro capturado com sucesso:", erro)

    print("\\nHistórico de operações:")
    for registro in calc.historico:
        print(" •", registro)
`;
}

export function generatePythonMatchCase(): string {
  return `"""
Calculadora Funcional com Match/Case (Python 3.10+)
Código conciso, moderno e com dicionário de operações.
"""
import operator

# Dicionário mapeando símbolos para funções padrão da biblioteca operator
OPERACOES = {
    '+': ('Adição', operator.add),
    '-': ('Subtração', operator.sub),
    '*': ('Multiplicação', operator.mul),
    '/': ('Divisão', operator.truediv),
}

def calcular(num1: float, operador: str, num2: float):
    """Executa a operação matemática correspondente."""
    if operador not in OPERACOES:
        raise ValueError(f"Operador desconhecido: '{operador}'")

    if operador == '/' and num2 == 0:
        return "Erro: Divisão por zero não é permitida!"

    _, funcao = OPERACOES[operador]
    return funcao(num1, num2)


def main():
    print("Calculadora Rápida Python (4 Operações)")
    print("Operadores suportados: +  -  *  /")
    print("Exemplo de entrada: 12 + 4.5 ou digite 'sair'\\n")

    while True:
        entrada = input("Expressão > ").strip()
        if entrada.lower() in ("sair", "exit", "q"):
            print("Encerrando...")
            break

        partes = entrada.split()
        if len(partes) != 3:
            print("Formato esperado: [número] [operador] [número] (separados por espaço)")
            continue

        str_n1, op, str_n2 = partes

        try:
            n1 = float(str_n1)
            n2 = float(str_n2)
        except ValueError:
            print("Erro: Os valores precisam ser numéricos válidos!")
            continue

        resultado = calcular(n1, op, n2)
        print(f"= {resultado}\\n")


if __name__ == "__main__":
    main()
`;
}

export function generatePythonTkinter(): string {
  return `"""
Calculadora com Interface Gráfica Desktop (Tkinter)
As 4 operações básicas com botões visuais e visor.
Não necessita instalar nada extra: o Tkinter já acompanha o Python!
"""
import tkinter as tk
from tkinter import messagebox

class CalculadoraGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculadora Python")
        self.root.geometry("320x420")
        self.root.resizable(False, False)
        self.root.configure(bg="#1e1e2e")

        self.expressao = ""

        # Visor
        self.visor = tk.Entry(
            root, font=("Helvetica", 22, "bold"),
            bg="#181825", fg="#cdd6f4",
            bd=0, justify="right", insertbackground="#cdd6f4"
        )
        self.visor.pack(fill="x", padx=16, pady=(20, 15), ipady=12)

        # Container dos botões
        frame_botoes = tk.Frame(root, bg="#1e1e2e")
        frame_botoes.pack(fill="both", expand=True, padx=16, pady=(0, 16))

        botoes = [
            ('C', 0, 0, '#f38ba8'), ('(', 0, 1, '#89b4fa'), (')', 0, 2, '#89b4fa'), ('/', 0, 3, '#fab387'),
            ('7', 1, 0, '#313244'), ('8', 1, 1, '#313244'), ('9', 1, 2, '#313244'), ('*', 1, 3, '#fab387'),
            ('4', 2, 0, '#313244'), ('5', 2, 1, '#313244'), ('6', 2, 2, '#313244'), ('-', 2, 3, '#fab387'),
            ('1', 3, 0, '#313244'), ('2', 3, 1, '#313244'), ('3', 3, 2, '#313244'), ('+', 3, 3, '#fab387'),
            ('0', 4, 0, '#313244'), ('.', 4, 1, '#313244'), ('⌫', 4, 2, '#45475a'), ('=', 4, 3, '#a6e3a1')
        ]

        for i in range(5):
            frame_botoes.grid_rowconfigure(i, weight=1)
        for j in range(4):
            frame_botoes.grid_columnconfigure(j, weight=1)

        for texto, linha, col, cor in botoes:
            btn = tk.Button(
                frame_botoes, text=texto, font=("Helvetica", 13, "bold"),
                bg=cor, fg="#11111b" if cor in ('#a6e3a1', '#f38ba8', '#fab387', '#89b4fa') else "#cdd6f4",
                activebackground="#585b70", activeforeground="#ffffff",
                relief="flat", bd=0,
                command=lambda t=texto: self.clique(t)
            )
            btn.grid(row=linha, column=col, sticky="nsew", padx=3, pady=3)

    def clique(self, tecla):
        if tecla == 'C':
            self.expressao = ""
            self.atualizar_visor()
        elif tecla == '⌫':
            self.expressao = self.expressao[:-1]
            self.atualizar_visor()
        elif tecla == '=':
            self.calcular()
        else:
            self.expressao += str(tecla)
            self.atualizar_visor()

    def atualizar_visor(self):
        self.visor.delete(0, tk.END)
        self.visor.insert(0, self.expressao if self.expressao else "0")

    def calcular(self):
        if not self.expressao:
            return
        try:
            # Validação simples para evitar divisão por zero antes do eval
            if "/0" in self.expressao.replace(" ", ""):
                messagebox.showerror("Erro", "Divisão por zero não é permitida!")
                return
            resultado = eval(self.expressao)
            self.expressao = str(round(resultado, 6) if isinstance(resultado, float) else resultado)
            self.atualizar_visor()
        except ZeroDivisionError:
            messagebox.showerror("Erro de Cálculo", "Divisão por zero!")
        except Exception:
            messagebox.showerror("Erro", "Expressão inválida.")


if __name__ == "__main__":
    janela = tk.Tk()
    app = CalculadoraGUI(janela)
    janela.mainloop()
`;
}
