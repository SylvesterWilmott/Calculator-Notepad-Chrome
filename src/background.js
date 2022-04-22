'use strict';

import * as storage from './js/storage.js';

let menuItems = [
  {
    id: 'theme',
    title: 'Theme',
    contexts: ['action']
  },
  {
    id: 'system',
    title: 'System',
    contexts: ['action'],
    parentId: 'theme',
    type:'radio'
  },
  {
    id: 'light',
    title: 'Light',
    contexts: ['action'],
    parentId: 'theme',
    type:'radio'
  },
  {
    id: 'dark',
    title: 'Dark',
    contexts: ['action'],
    parentId: 'theme',
    type:'radio'
  },
  {
    id: 'font',
    title: 'Font',
    contexts: ['action']
  },
  {
    id: 'mono',
    title: 'Monospace',
    contexts: ['action'],
    parentId: 'font',
    type:'radio'
  },
  {
    id: 'sans',
    title: 'Sans Serif',
    contexts: ['action'],
    parentId: 'font',
    type:'radio'
  },
  {
    id: 'separator_main_1',
    type: 'separator',
    contexts: ['action']
  },
  {
    id: 'clear',
    title: 'Clear Data',
    contexts: ['action']
  },
  {
    id: 'resetPrefs',
    title: 'Reset Preferences',
    contexts: ['action']
  }
];

chrome.runtime.onInstalled.addListener(init);
chrome.contextMenus.onClicked.addListener(handleClick);

async function init() {
  for (const item of menuItems) {
    await createMenuItem(item);
  }

  updateRadioControls();
};

function createMenuItem(item) {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.create(item, function() {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      }
      resolve();
    });
  });
};

async function handleClick(info) {
  const menuId = info.menuItemId;

  switch(menuId) {
    case 'clear':
      await storage.clear('text');
      break;
    case 'resetPrefs':
      await storage.clear('theme');
      await storage.clear('font');

      updateRadioControls();
      break;
    case 'system':
    case 'light':
    case 'dark':
      await storage.save('theme', menuId);
      break;
    case 'sans':
    case 'mono':
      await storage.save('font', menuId);
      break;
  }
};

async function updateRadioControls() {
  let theme = await storage.load('theme', 'system');
  let font  = await storage.load('font', 'mono');

  checkRadio(theme, font);
};

function checkRadio(...ids) {
  for (const id of ids) {
    chrome.contextMenus.update(id, {
      checked: true
    }, function() {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      }
    });
  }
};
