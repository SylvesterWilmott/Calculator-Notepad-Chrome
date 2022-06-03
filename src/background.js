"use strict";

import * as storage from "./js/storage.js";

let menuItems = [
  {
    id: "theme",
    title: chrome.i18n.getMessage("menu_theme"),
    contexts: ["action"],
  },
  {
    id: "system",
    title: chrome.i18n.getMessage("menu_theme_system"),
    contexts: ["action"],
    parentId: "theme",
    type: "radio",
  },
  {
    id: "light",
    title: chrome.i18n.getMessage("menu_theme_light"),
    contexts: ["action"],
    parentId: "theme",
    type: "radio",
  },
  {
    id: "dark",
    title: chrome.i18n.getMessage("menu_theme_dark"),
    contexts: ["action"],
    parentId: "theme",
    type: "radio",
  },
  {
    id: "font",
    title: chrome.i18n.getMessage("menu_font"),
    contexts: ["action"],
  },
  {
    id: "mono",
    title: chrome.i18n.getMessage("menu_font_monospace"),
    contexts: ["action"],
    parentId: "font",
    type: "radio",
  },
  {
    id: "sans",
    title: chrome.i18n.getMessage("menu_font_sans"),
    contexts: ["action"],
    parentId: "font",
    type: "radio",
  },
  {
    id: "separator_main_1",
    type: "separator",
    contexts: ["action"],
  },
  {
    id: "clear",
    title: chrome.i18n.getMessage("menu_clearData"),
    contexts: ["action"],
  },
  {
    id: "resetPrefs",
    title: chrome.i18n.getMessage("menu_resetPrefs"),
    contexts: ["action"],
  },
];

chrome.runtime.onInstalled.addListener(init);
chrome.contextMenus.onClicked.addListener(handleClick);

async function init() {
  for (const item of menuItems) {
    await createMenuItem(item);
  }

  updateRadioControls();
}

function createMenuItem(item) {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.create(item, function () {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      }
      resolve();
    });
  });
}

async function handleClick(info) {
  const menuId = info.menuItemId;

  switch (menuId) {
    case "clear":
      await storage.clear("text");
      break;
    case "resetPrefs":
      await storage.clear("theme");
      await storage.clear("font");

      updateRadioControls();
      break;
    case "system":
    case "light":
    case "dark":
      await storage.save("theme", menuId);
      break;
    case "sans":
    case "mono":
      await storage.save("font", menuId);
      break;
  }
}

async function updateRadioControls() {
  let theme = await storage.load("theme", "system");
  let font = await storage.load("font", "mono");

  checkRadio(theme, font);
}

function checkRadio(...ids) {
  for (const id of ids) {
    chrome.contextMenus.update(
      id,
      {
        checked: true,
      },
      function () {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
        }
      }
    );
  }
}
