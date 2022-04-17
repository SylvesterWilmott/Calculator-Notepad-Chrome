'use strict';

export const commentRegex      = /^[\/]{2}(.*?)$/gm;
export const headingRegex      = /^(.*?):$/gm;
export const variableRegex     = /^\s*([a-zA-Z_]+) ?(\bis\b|=) ?([^=]+)$/gm;
export const wordRegex         = /[a-z_]+/gi;
export const numberSuffixRegex = /(\d+(?:\.\d+)?)([KkMB]{1}\b)/g;
