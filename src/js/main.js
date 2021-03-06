"use strict";

import * as constants from "./constants.js";
import * as regex from "./regex.js";
import * as reserved from "./reserved.js";
import * as storage from "./storage.js";

let input;
let output;
let lastEdit = []; // Last known edit by line
let expressions = []; // All tokenized expressions by line

document.addEventListener("DOMContentLoaded", init);

async function init() {
  input = document.getElementById("input");
  output = document.getElementById("output");

  const text = await storage.load("text", "");
  const scroll = await storage.load("scroll", 0);
  const theme = await storage.load("theme", "system");
  const font = await storage.load("font", "mono");

  initConstants();
  populateLastEdit(text);

  tokenize(text, "init");

  const results = getResultTokens();

  addclassToBody(theme, font);
  updateInputDisplay(text);
  updateOutputDisplay(results);
  setScrollPos(scroll);
  initListeners();
  showUi();
}

function populateLastEdit(value) {
  lastEdit = value.split("\n");
}

function initConstants() {
  addConstantsTo(reserved.identifiers);
  addConstantsTo(constants.identifiers);
}

function addConstantsTo(arr) {
  for (const constant of constants.constants) {
    arr.push(constant.indentifier);
  }
}

function addclassToBody(...args) {
  for (const item of args) {
    document.body.classList.add(item);
  }
}

function updateInputDisplay(text) {
  input.innerText = text;
}

function updateOutputDisplay(results) {
  for (const [i, result] of results.entries()) {
    let button;
    let span;
    let br = document.createElement("br");
    let value = result.value;
    let len = results.length;

    value =
      typeof value === "number"
        ? value.toLocaleString(undefined, { maximumFractionDigits: 10 })
        : value;

    switch (result.type) {
      case "null":
        break;
      case "variable":
      case "result":
        button = document.createElement("button");
        button.innerText = value;
        button.classList.add("result-btn");
        button.classList.add(result.type);
        output.appendChild(button);
        break;
      case "error":
        span = document.createElement("span");
        span.innerText = "Error";
        span.setAttribute("title", value);
        span.classList.add(result.type);
        output.appendChild(span);
        break;
    }

    if (len > i + 1) {
      output.appendChild(br);
    }
  }
}

function setScrollPos(value) {
  document.body.scrollTop = value;
}

function initListeners() {
  input.addEventListener("input", inputOnInput, false);
  input.addEventListener("keydown", inputOnKeydown, false);
  output.addEventListener("click", outputOnClick, false);
  document.body.addEventListener("scroll", documentOnScroll, false);
}

function showUi() {
  document.getElementById("container").style.opacity = 1;
}

function validateWord(arr, word) {
  let status = arr.includes(word);

  return status;
}

function insertTextAtCaret(...nodes) {
  for (const node of nodes) {
    document.execCommand("insertText", false, node);
  }
}

function clearInnerText(element) {
  element.innerText = "";
}

async function copyValueToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (err) {
    alert("Failed to copy text");
  }
}

function startParse(value) {
  clearInnerText(output);
  tokenize(value);

  const results = getResultTokens();

  updateOutputDisplay(results);
  populateLastEdit(value);
}

function removeTabs(value) {
  return value.replace(/\t/g, "");
}

function tokenize(value, src) {
  let lines = value.split("\n");
  let token;

  let isEdited = false;
  let editedVariables = [];

  for (const [i, line] of lines.entries()) {
    let str = line;
    let lastEditStr = lastEdit[i];

    if (str.match(regex.tabRegex)) {
      str = removeTabs(str);
    }

    if (lastEdit[i] && lastEditStr.match(regex.tabRegex)) {
      lastEditStr = removeTabs(lastEditStr);
    }

    let comment = str.match(regex.commentRegex);
    let heading = str.match(regex.headingRegex);
    let variable = str.match(regex.variableRegex);
    let words = str.match(regex.wordRegex);

    if (!lastEditStr || str !== lastEditStr) {
      isEdited = true; // Mark lines that are edited
    }

    for (const variable of editedVariables) {
      let nameBoundary = new RegExp(makeRegexBoundary(variable), "g");

      if (str.match(nameBoundary)) {
        isEdited = true; // Mark lines that contain edited variables
      }
    }

    if (isEdited || src === "init") {
      isEdited = false;

      if (str.length === 0) {
        token = {
          type: "newline",
          value: "",
        };
      } else if (comment || heading) {
        token = {
          type: "comment",
          value: str.trim(),
        };
      } else {
        // Expand abbrebiated numbers
        if (str.match(regex.numberSuffixRegex)) {
          let matches = [...str.matchAll(regex.numberSuffixRegex)];

          for (const match of matches) {
            let m = match[0];
            let value = match[1];
            let modifier = match[2];
            let newValue;

            switch (modifier) {
              case "k":
              case "K":
                newValue = value * 1000;
                str = str.replace(m, newValue);
                break;
              case "M":
                newValue = value * 1000000;
                str = str.replace(m, newValue);
                break;
              case "B":
                newValue = value * 1000000000;
                str = str.replace(m, newValue);
                break;
            }
          }
        }

        if (variable) {
          token = getVariableToken(str, expressions, i);
        } else {
          let tmp = str;

          if (tmp.includes("=")) {
            tmp = tmp.replace("=", "");
          }

          if (words) {
            for (const word of words) {
              let isConstant = validateWord(constants.identifiers, word);

              if (isConstant) {
                let find = constants.constants.find(
                  (x) => x.indentifier === word
                );
                tmp = replaceTextWithValue(tmp, word, find.value);
              }

              let obj = expressions.find((x) => x.name === word);
              tmp = obj ? replaceTextWithValue(tmp, word, obj.value) : tmp;
            }
          }

          if (hasNumber(tmp)) {
            let result;
            let val = tmp.trim();

            try {
              result = mexp.eval(val);
            } catch (err) {
              result;
            }

            token = {
              type: "expression",
              value: tmp.trim(),
              result: result,
            };
          } else {
            token = {
              type: "comment",
              value: tmp.trim(),
            };
          }
        }
      }

      expressions[i] = token;
    }
  }

  function getVariableToken(str, expressions, i) {
    let equalsBoundary = new RegExp(makeRegexBoundary("is"), "g");

    if (str.match(equalsBoundary)) {
      str = str.replace(equalsBoundary, "=");
    }

    let split = str.split("=");
    let name = split[0].trim();
    let value = split[1].trim();

    if (expressions[i] && expressions[i].name !== name) {
      // If the variable name is modified...
      editedVariables.push(expressions[i].name); // Store the previous name...
      editedVariables.push(name); // And the new name
    } else {
      editedVariables.push(name);
    }

    let isReserved = validateWord(reserved.identifiers, name);
    let isExistingVariableIndex = expressions.findIndex((x) => x.name === name);

    if (isReserved) {
      return {
        type: "error",
        name: name,
        value: "Invalid variable name",
      };
    }

    if (isExistingVariableIndex < i && isExistingVariableIndex !== -1) {
      return {
        type: "error",
        name: name,
        value: "Variable already declared",
      };
    }

    let words = value.match(regex.wordRegex);

    if (words) {
      for (const word of words) {
        let isConstant = validateWord(constants.identifiers, word);

        if (isConstant) {
          let find = constants.constants.find((x) => x.indentifier === word);
          value = replaceTextWithValue(value, word, find.value);
        }

        let obj = expressions.find((x) => x.name === word);
        value = obj
          ? replaceTextWithValue(value, word, obj.value)
          : value.replace(word, "");
      }
    }

    let boundary = /^(\d+(?:\.\d+)?)$/gm; // Any number with optional decimal point

    if (value.match(boundary)) {
      value = value;
    } else {
      try {
        value = mexp.eval(value);
      } catch (err) {
        value = value;
      }
    }

    value = Number(value);

    if (isNaN(value)) {
      value = "";
    }

    return {
      type: "variable",
      name: name,
      value: value,
    };
  }

  function replaceTextWithValue(str, find, replace) {
    return str.replace(new RegExp(makeRegexBoundary(find), "gi"), replace);
  }

  function makeRegexBoundary(str) {
    return "\\b" + str + "\\b";
  }

  function hasNumber(str) {
    return /\d/.test(str);
  }

  if (expressions.length !== lines.length) {
    expressions.length = lines.length;
  }

  editedVariables = []; // Reset
}

function getResultTokens() {
  let results = [];

  for (const expression of expressions) {
    switch (expression.type) {
      case "newline":
      case "comment":
        results.push({
          type: "null",
          value: "",
        });
        break;
      case "variable":
        results.push({
          type: "variable",
          value: expression.value,
        });
        break;
      case "error":
        results.push({
          type: "error",
          value: expression.value,
        });
        break;
      case "expression":
        let result = expression.result;

        if (isNaN(result) || result == null) {
          results.push({
            type: "null",
            value: "",
          });
        } else {
          results.push({
            type: "result",
            value: result,
          });
        }
        break;
    }
  }

  return results;
}

// Event handlers

function inputOnInput(e) {
  const value = input.innerText;

  startParse(value);
  saveText(e);
}

function inputOnKeydown(e) {
  if (e.key === "Tab") {
    e.preventDefault();
    insertTextAtCaret("\t");
    saveText(e);
  }
}

function outputOnClick(e) {
  const activeEl = document.activeElement;
  const shiftPressed = e.shiftKey;
  const target = e.target;
  const classes = ["result", "variable"];

  if (classes.some((className) => target.classList.contains(className))) {
    let value = target.innerText;

    value = value.replace(/,/g, "");

    if (shiftPressed) {
      insertTextAtCaret(value);
    } else {
      copyValueToClipboard(value);
    }
  }
}

function documentOnScroll(e) {
  saveScroll(e);
}

const saveScroll = debounce(async function (e) {
  await storage.save("scroll", document.body.scrollTop);
}, 1000);

const saveText = debounce(async function (e) {
  await storage.save("text", input.innerText);
}, 1000);

function debounce(callback, wait) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), wait);
  };
}
