'use strict';

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

chrome.runtime.onInstalled.addListener(function() {
  for (const item of menuItems) {
    chrome.contextMenus.create(item, function() {
      if (chrome.runtime.lastError) {
        console.log(err.message);
      }

      updatePrefsDisplay();
    });
  }
});

chrome.contextMenus.onClicked.addListener(function(info) {
  let menuId = info.menuItemId;

  switch(menuId) {
    case 'clear':
      clearFromStorage('text', 'results');
      break;
    case 'resetPrefs':
      clearFromStorage('theme', 'font');
      break;
    case 'system':
    case 'light':
    case 'dark':
      saveToStorage('theme', menuId);
      break;
    case 'sans':
    case 'mono':
      saveToStorage('font', menuId);
      break;
  }
});

async function updatePrefsDisplay() {
  let theme = await loadFromStorage('theme', 'system');
  let font = await loadFromStorage('font', 'mono');

  chrome.contextMenus.update(theme, { checked: true });
  chrome.contextMenus.update(font, { checked: true });
};

function clearFromStorage(...keys) {
  for (const key of keys) {
    chrome.storage.local.remove(key, function() {
      if (chrome.runtime.lastError) {
        console.log(err.message);
      }

      updatePrefsDisplay();
    });
  }
};

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
