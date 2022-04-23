# Calculator Notepad

Calculator Notepad is an open source, free-form text calculator, Chrome extension.

## Installation

1. Download and uncompress zip.
2. In Chrome, go to the extensions page at `chrome://extensions/`.
3. Enable Developer Mode.
4. Choose `Load Unpacked` and select the Calculator Notepad folder.

## Usage

### Basic

Calculator Notepad will analyse each line in the input and attempt to calculate any expressions it finds. Each new line represents a new expression.

```
100 + 100
200 - (50 + 50)
```

To help give context to your calculations, you can type notes which Calculator Notepad will recognise as a `comment`. A comment can also be defined by starting the line with `//` or ending it with `:`.

```
Total amount:
```

```
// Total amount
```

### Operations

| Token            | Details                                 |
| :--------------- | :-------------------------------------- |
| `+`              | Addition Operator eg. `3 + 2`           |
| `-`              | Subtraction Operator eg. `3 - 2`        |
| `/`              | Division Operator eg. `6 / 2`           |
| `*`              | Multiplication Operator eg. `3 * 2`     |
| `!`              | Factorial Operator eg. `3!`             |
| `^`              | Exponent Operator eg. `3 ^ 2`           |
| `Mod`            | Modulus Operator eg. `3 Mod 2`          |
| `C`              | Combination Operator eg. `3 C 2`        |
| `P`              | Permutation Operator eg. `3 P 2`        |

### Functions

| Token            | Details                                 |
| :--------------- | :-------------------------------------- |
| `!`              | Factorial eg. `3!`                      |
| `Sigma`          | Summation eg. `Sigma(1, 10, n)`         |
| `Pi`             | Product eg. `Pi(1, 10, n)`              |
| `n`              | Variable for summation or product       |
| `root`           | Square Root Function eg. `root 9`       |
| `pow`            | Power Function eg. `pow(2, 3)`          |
| `log`            | Logarithmic Function eg. `log 100`      |
| `ln`             | Natural Logarithmic Function eg. `ln 3` |
| `sin`            | Sine eg. `sin 45`                       |
| `cos`            | Cosine eg. `cos 30`                     |
| `tan`            | Tangent eg. `tan 10`                    |

### Mathematical Constants

| Token            | Details                                 |
| :--------------- | :-------------------------------------- |
| `pi`             | Mathematical Constant Pi                |
| `e`              | Mathematical Constant Euler's Number    |
| `g`              | Mathematical Constant Euler's Constant  |
| `phi`            | Mathematical Constant Golden Ratio      |

### Variables

Calculator Notepad supports custom variables which allows you to assign values to words to help give more context to your expressions. Variables should follow some simple rules.

1. Variable names can consist of letters and underscores.
2. Variable names should not contain spaces.
3. Variable names are case-sensitive.
4. Variables can only be declared once.
5. Variables names cannot be a symbol that represents a function or operator.

To declare a variable, type the name followed by `=` or `is` and the value you want to assign.

```
expenses = 2000
budget is 5000
```

Once a variable has been declared, you can reference it at any point after it's declaration. Attempting to reference a variable before it has been declared will result in an error.

```
expenses = 5000
10000 - expenses
```

Variables can be also referenced within separate variable declarations.

```
expenses = 5000
subtotal = expenses - 1000
```

To change the value of a variable, simply update the variable value in the text input area and all expressions containing your variable will be automatically updated.

### Options

To access options, right-click on the extension icon.

- Choose from system, light or dark themes.
- Choose from sans-serif or monospace fonts.

## Attributions

- Calculations are performed by the brilliant [math-expression-evaluator](https://github.com/bugwheels94/math-expression-evaluator).
