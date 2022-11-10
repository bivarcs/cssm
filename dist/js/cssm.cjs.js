/*! @bivarcs/cssm 0.0.1 | MIT | https://github.com/bivarcs/cssm */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
    if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  }
  return a;
};
class CSSM {
  constructor() {
    this.cache = [];
    this.style = [];
  }
  update() {
    for (let a = this.style, i = 0; a.length > i; i++) {
      let styleEntry = a[i];
      for (let aa = styleEntry.use, ii = 0; aa.length > ii; ii++) {
        let sourceEntry = aa[ii];
        if (this.isDead(sourceEntry)) {
          styleEntry.use.splice(ii--, 1);
        }
      }
      if (!styleEntry.use.length) {
        styleEntry.element.remove();
        this.style.splice(i--, 1);
      }
    }
  }
  attach(id, source, life) {
    const cacheEntry = this.findCache(id);
    if (cacheEntry) {
      var styleEntry = this.findStyle(id);
      if (!styleEntry) {
        const styleE2 = document.createElement("style");
        styleE2.innerHTML = cacheEntry.text;
        this.style.push(styleEntry = {
          id,
          element: styleE2,
          use: []
        });
      }
      const styleE = styleEntry.element;
      if (!styleEntry.use.some(entry => entry.source === source)) {
        const sourceEntry = {
          source,
          life
        };
        if (!this.isDead(sourceEntry)) {
          styleEntry.use.push(sourceEntry);
        }
      }
      if (!document.head.contains(styleE)) {
        document.head.appendChild(styleE);
      }
    }
  }
  detach(href, source) {
    const cacheEntry = this.findCache(href);
    if (cacheEntry) {
      const styleEntry = this.findStyle(href);
      if (styleEntry) {
        for (let a = styleEntry.use, i = 0; a.length > i; i++) {
          let entry = a[i];
          if (entry.source === source) {
            styleEntry.use.splice(i--, 1);
          }
        }
      }
    }
  }
  isDead(entry) {
    const {
      source,
      life
    } = entry;
    if ("string" === typeof life) {
      return !source[life];
    } else if ("function" === typeof life) {
      return !life(source);
    }
    return false;
  }
  findStyle(id) {
    return this.find("style", id);
  }
  findCache(id) {
    return this.find("cache", id);
  }
  find(store, id) {
    for (let a = this[store], i = 0; a.length > i; i++) {
      let entry = a[i];
      if (entry.id === id) return entry;
    }
  }
  create(id, cssText) {
    if (!this.cache.some(entry => entry.id === id)) {
      this.cache.push({
        id,
        text: cssText
      });
    }
  }
  load(href, requestInit) {
    let entry = this.findCache(href);
    return entry ? Promise.resolve(href) : new Promise(resolve => {
      fetch(href, __spreadValues({
        method: "GET"
      }, requestInit || {})).then(res => res.text()).then(cssText => {
        this.create(href, cssText);
        resolve(href);
      }).catch(err => {
        console.error(err);
        resolve(false);
      });
    });
  }
  destroy() {
    this.style.forEach(entry => {
      entry.element.remove();
    });
    this.cache.length = 0;
    this.style.length = 0;
    this.status = false;
  }
}
exports["default"] = CSSM;
