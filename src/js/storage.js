'use strict';

export function save(key, value) {
  chrome.storage.local.set({ [key]: value });
};

export function load(key, defaults) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({
      [key]: defaults
    }, function(value) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      }
      resolve(value[key]);
    });
  });
};
