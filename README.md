# 🧮 Calculadora em Python (4 Operações Básicas)

Desenvolvi este projeto com o objetivo de criar uma calculadora interativa em Python via linha de comando (CLI), aplicando boas práticas de programação, modularização, tratamento seguro de exceções e histórico de operações.

---

## 📌 Visão Geral do Projeto

A aplicação permite ao usuário realizar cálculos aritméticos contínuos através de um menu interativo no terminal. O código foi projetado para ser intuitivo, tolerante a falhas de digitação e protegido contra erros matemáticos críticos, como a divisão por zero.

---

## 🏗️ Principais Componentes do Código

Para manter o código limpo e de fácil manutenção, separei as responsabilidades em blocos bem definidos:

1. **Módulo de Operações Aritméticas (`somar`, `subtrair`, `multiplicar`, `dividir`):**
   * Criei funções puras e dedicadas para cada uma das quatro operações básicas. Cada função recebe dois parâmetros (`a` e `b`) com anotações de tipo (*type hints*) e retorna o valor resultante.
   * Na função `dividir()`, implementei uma trava lógica para checar se o divisor é igual a zero, evitando paradas inesperadas do sistema.

2. **Tratamento de Exceções (`try / except`):**
   * Utilizei um bloco `try / except ValueError` durante a captura de dados para interceptar casos em que o usuário digite letras ou caracteres especiais em vez de números.

3. **Interface e Menu (`exibir_menu`):**
   * Função responsável apenas por desenhar o menu visual no terminal, listando as opções numeradas de `0` a `5`.

4. **Laço de Execução Principal (`while True` em `main`):**
   * Mantém o programa rodando continuamente para que o usuário possa fazer vários cálculos seguidos sem precisar reiniciar o script a cada operação.

5. **Histórico da Sessão (`historico`):**
   * Uma lista em Python que acumula todas as operações bem-sucedidas realizadas durante a sessão atual.

6. **Ponto de Entrada (`if __name__ == "__main__":`):**
   * Garante a execução da função principal apenas quando o script for chamado diretamente.

---

## 📥 Como a Aplicação Recebe Dados e Identifica a Operação

A leitura dos dados e a identificação do cálculo ocorrem em três etapas lógicas:

1. **Captura da Opção:**
   * Leio a entrada do usuário através de `input()` e aplico o método `.strip()` para remover espaços em branco acidentais:
   ```python
   opcao = input("Escolha uma opção (0-5): ").strip()

⚙️ Lógica de Programação e Apresentação dos Resultados
  Despacho Condicional (if / elif):
  Utilizei uma estrutura de decisão simples e eficiente que direciona os números digitados para a função matemática exata correspondente à opção escolhida.
  Prevenção da Divisão por Zero:
  Antes de realizar a divisão (a / b), o código avalia:
  if b == 0:
      return "Erro: Divisão por zero não é permitida!"
  return a / b
  Dessa forma, caso o denominador seja zero, a aplicação retorna uma mensagem amigável sem interromper a execução do programa.
  Formatação e Feedback Visual:
  Utilizei f-strings do Python para interpolar os dados de entrada, o operador matemático e o resultado final em uma única linha legível (exemplo: 15.0 + 27.0 = 42.0), imprimindo o resultado com destaque no terminal e salvando essa string na lista de histórico.

🚀 Como Executar o Projeto Localmente
    Pré-requisitos
    Python 3.8 ou superior instalado.
    Passo a Passo
    Clone o repositório ou baixe o arquivo calculadora.py:
    code
    Bash
    git clone https://github.com/seu-usuario/calculadora-python.git
    cd calculadora-python
    Execute o arquivo no terminal:
    No Windows:
    code
    Bash
    python calculadora.py
    No macOS / Linux:
    code
    Bash
    python3 calculadora.py
    Escolha a operação desejada no menu interativo e digite os números!
