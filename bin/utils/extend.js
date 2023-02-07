import type from './type.js'
import clone from './clone.js';

const hasOwnProp = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

const extend = (defaultOpt, customOpt) => {
    defaultOpt = clone(defaultOpt);
    for (let name in customOpt) {
      const src = defaultOpt[name];
      const copy = customOpt[name];
      if (!hasOwnProp(customOpt, name)) {
          continue;
      }
      
      if (copy && type(copy) === 'object') {
        const clone = src && type(src) === 'object' ? src : {};
        defaultOpt[name] = extend(clone, copy);
      } else if (typeof copy !== 'undefined'){
        defaultOpt[name] = copy;
      }
    }
  return defaultOpt;
}

export default extend
