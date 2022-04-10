'use strict';

import * as constants from './constants.js';

const commentRegex  = /^[\/]{2}(.*?)$/gm;
const variableRegex = /^\s*([a-zA-Z_]+) ?(\bis\b|=) ?([^=]+)$/gm;
const wordRegex     = /[a-z_]+/gi;
const numberRegex   = /[0-9]/g;

let input;
let output;

let reserved = ['Mod', 'C', 'P', 'Sigma', 'Pi', 'n', 'root', 'pow', 'log', 'ln', 'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'asin', 'acos', 'atan', 'asinh', 'acosh', 'atanh'];
let identifiers = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {
  input = document.getElementById('input');
  output = document.getElementById('output');

  addConstantsToArray(reserved);
  addConstantsToArray(identifiers);

  const storedText = await loadFromStorage('text', null);
  const storedResults = await loadFromStorage('results', []);
  const scrollPos = await loadFromStorage('scroll', 0);
  const theme = await loadFromStorage('theme', 'system');
  const font = await loadFromStorage('font', 'mono');

  addPrefClass(theme);
  addPrefClass(font);
  displayExpressions(storedText);
  displayResults(storedResults);
  setScrollPos(scrollPos);
  initListeners();

  document.body.classList.remove('hidden');
};

function addConstantsToArray(arr) {
  for (const constant of constants.constants) {
    arr.push(constant.indentifier);
  }
};

function addPrefClass(className) {
  document.body.classList.add(className);
};

function displayExpressions(expressions) {
  input.innerHTML = expressions;
};

function displayResults(results) {
  for (const [i, result] of results.entries()) {
    let span = document.createElement('span');
    let br = document.createElement('br');
    let value = result.value;
    let len = results.length;

    value = typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 10 }) : value;

    span.innerText = value;

    switch (result.type) {
      case 'null':
        span.classList.add('null');
        break;
      case 'variable':
        span.classList.add('variable');
        break;
      case 'result':
        span.classList.add('result');
        break;
      case 'error':
        span.classList.add('error');
        break;
    }

    output.appendChild(span);

    if (len > i + 1) {
      output.appendChild(br);
    }
  }
};

function setScrollPos(value) {
  document.body.scrollTop = value;
};

function initListeners() {
  input.addEventListener('input', handleInput, false);
  input.addEventListener('keydown', handleKeydown, false);
  output.addEventListener('click', copyInnerTextToClipboard, false);
  document.body.addEventListener('scroll', handleScroll, false);
};

function debounce(callback, wait) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), wait);
  };
};

function validateWord(arr, word) {
  let status = arr.includes(word);

  return status;
};

function insertNodeAtCaret(node) {
  let sel = document.getSelection();
  let range = sel.getRangeAt(0);
  let newNode = document.createTextNode(node);

  range.insertNode(newNode);

  range.setStartAfter(newNode);
  range.setEndAfter(newNode);

  sel.removeAllRanges();
  sel.addRange(range);
};

function clearInnerText(el) {
  el.innerText = '';
};

async function start(value) {
  clearInnerText(output);

  let expressions = await parse(value);
  let results = await getResults(expressions);

  displayResults(results);
  saveToStorage('text', value);
  saveToStorage('results', results);
};

function parse(value) {
  return new Promise((resolve, reject) => {
    let lines = value.split('\n');
    let expressions = [];
    let pass;

    for (const line of lines) {
      let str = line;
      let comment = str.match(commentRegex);
      let variable = str.match(variableRegex);
      let words = str.match(wordRegex);

      if (str.length === 0) {
        pass = {
          type: 'newline',
          value: ''
        }
      } else if (comment) {
        pass = {
          type: 'comment',
          value: str.trim()
        }
      } else if (variable) {
        pass = getVariableObject(str, expressions);
      } else {
        let tmp = str;

        if (tmp.includes('=')) {
          tmp = tmp.replace('=', '');
        }

        if (words) {
          for (const word of words) {
            let isConstant = validateWord(identifiers, word);

            if (isConstant) {
              let find = constants.constants.find(x => x.indentifier === word);
              tmp = replaceTextWithValue(tmp, word, find.value);
            }

            let obj = expressions.find(x => x.name === word);
            tmp = obj ? replaceTextWithValue(tmp, word, obj.value) : tmp;
          }
        }

        if (tmp.match(numberRegex)) {
          pass = {
            type: 'expression',
            value: tmp.trim()
          }
        } else {
          pass = {
            type: 'comment',
            value: tmp.trim()
          }
        }
      }

      expressions.push(pass);
    }

    function getVariableObject(str, expressions) {
      if (str.includes('is')) {
        str = str.replace(/\bis\b/g, '=');
      }

      let split = str.split('=');
      let name = split[0].trim();
      let value = split[1].trim();

      let isReserved = validateWord(reserved, name);
      let isExistingVariable = expressions.find(x => x.name === name);

      if (isReserved) {
        return {
          type: 'error',
          name: name,
          value: 'Error: Invalid variable name'
        }
      }

      if (isExistingVariable) {
        return {
          type: 'error',
          name: name,
          value: 'Error: Variable already declared'
        }
      }

      let words = value.match(wordRegex);

      if (words) {
        for (const word of words) {
          let isConstant = validateWord(identifiers, word);

          if (isConstant) {
            let find = constants.constants.find(x => x.indentifier === word);
            value = replaceTextWithValue(value, word, find.value);
          }

          let obj = expressions.find(x => x.name === word);
          value = obj ? replaceTextWithValue(value, word, obj.value) : value.replace(word, '');
        }
      }

      let boundary = /^[0-9]+$/gm;

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
        value = '';
      }

      return {
        type: 'variable',
        name: name,
        value: value
      }
    };

    function replaceTextWithValue(str, find, replace) {
      return str.replace(new RegExp(escapeRegExp(find), 'gi'), replace);
    };

    function escapeRegExp(str) {
      return '\\b' + str + '\\b';
    };

    resolve(expressions);
  });
};

function getResults(expressions) {
  return new Promise((resolve, reject) => {
    let tmp = [];

    for (const expression of expressions) {
      switch (expression.type) {
        case 'newline':
        case 'comment':
          tmp.push({
            type: 'null',
            value: ''
          });
          break;
        case 'variable':
          tmp.push({
            type: 'variable',
            value: expression.value
          });
          break;
        case 'error':
          tmp.push({
            type: 'error',
            value: expression.value
          });
          break;
        case 'expression':
          let result;

          try {
            result = mexp.eval(expression.value);
          } catch (err) {
            result;
          }

          if (isNaN(result) || result == null) {
            tmp.push({
              type: 'error',
              value: 'Error'
            });
          } else {
            tmp.push({
              type: 'result',
              value: result
            });
          }
          break;
      }
    }

    resolve(tmp);
  });
};

// Event handlers

const handleInput = debounce(function(e){
  const value = input.innerText;

  start(value);
}, 500);

const handleScroll = debounce(function(e){
  saveToStorage('scroll', document.body.scrollTop);
}, 500);

function handleKeydown(e) {
  switch (e.key) {
    case 'Tab':
      e.preventDefault();
      insertNodeAtCaret('\t');
      saveToStorage('text', input.innerText);
      break;
  }
};

async function copyInnerTextToClipboard(e) {
  const target = e.target;
  const classes = ['result', 'variable'];

  if (classes.some(className => target.classList.contains(className))) {
    let value = target.innerText;

    value = value.replace(/,/g, '');

    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      alert('Failed to copy text');
    }
  }
};

// Chrome storage

function saveToStorage(key, value) {
  chrome.storage.local.set({ [key]: value });
};

function loadFromStorage(key, defaults) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({
      [key]: defaults
    }, function(value) {
      if (chrome.runtime.lastError) {
        console.log(err.message);
      }
      resolve(value[key]);
    });
  });
};
