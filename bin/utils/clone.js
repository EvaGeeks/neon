import type from './type.js';

const hasOwnProp = (obj, key) =>{
    return Object.prototype.hasOwnProperty.call(obj, key);
}

const isClone = (x) => {
    const t = type(x);
    return t === 'object' || t === 'array';
}

const clone = (x) => {
    if (!isClone(x)) return x;
    const t = type(x);
    let res;
    if (t === 'array') {
      res = [];
      for (let i = 0; i < x.length; i++) {
        res[i] = x[i] === x ? res: clone(x[i]);
      }
    } else if (t === 'object') {
      res = {};
      for(let key in x) {
        if (hasOwnProp(x, key)) {
          res[key] = x[key] === x ? res : clone(x[key]);
        }
      }
    }
    return res;
}

const cloneJSON = (x, errOrDef = true) => {
    if (!isClone(x)) return x;
    try {
      return JSON.parse(JSON.stringify(x));
    } catch(e) {
      if (errOrDef === true) {
          throw e;
      } else {
        try {
          console.error('cloneJSON error: ' + e.message);
        } catch(e) {}
        return errOrDef;
      }
    }
}

const cloneLoop = (x) => {
    const t = type(x);
    let root = x;
    if (t === 'array') {
      root = [];
    } else if (t === 'object') {
      root = {};
    }
    const loopList = [
      {
        parent: root,
        key: undefined,
        data: x,
      }
    ];

    while(loopList.length) {
      const node = loopList.pop();
      const parent = node.parent;
      const key = node.key;
      const data = node.data;
      const tt = type(data);

      let res = parent;
      if (typeof key !== 'undefined') {
        res = parent[key] = tt === 'array' ? [] : {};
      }

      if (tt === 'array') {
        for (let i = 0; i < data.length; i++) {
          if (data[i] === data) {
            res[i] = res;
          } else if (isClone(data[i])) {
            loopList.push({
              parent: res,
              key: i,
              data: data[i],
            });
          } else {
            res[i] = data[i];
          }
        }
      } else if (tt === 'object'){
        for(let k in data) {
          if (hasOwnProp(data, k)) {
            if (data[k] === data) {
              res[k] = res;
            } else if (isClone(data[k])) {
              loopList.push({
                parent: res,
                key: k,
                data: data[k],
              });
            } else {
              res[k] = data[k];
            }
          }
        }
      }
    }
  return root;
}

const UNIQUE_KEY = 'thatshinji.clone' + (new Date).getTime();
const SimpleWeakmap = () => {
  this.cacheArray = [];
}

SimpleWeakmap.prototype.set = function(key, value){
  this.cacheArray.push(key);
  key[UNIQUE_KEY] = value;
};
SimpleWeakmap.prototype.get = function(key){
  return key[UNIQUE_KEY];
};
SimpleWeakmap.prototype.clear = function(){
  for (let i = 0; i < this.cacheArray.length; i++) {
    let key = this.cacheArray[i];
    delete key[UNIQUE_KEY];
  }
  this.cacheArray.length = 0;
};

const getWeakMap =() => {
  let result;
  if(typeof WeakMap !== 'undefined' && type(WeakMap)== 'function'){
    result = new WeakMap();
    if(type(result) == 'weakmap'){
        return result;
    }
  }
  result = new SimpleWeakmap();
  return result;
}

const cloneForce = (x) => {
  const uniqueData = getWeakMap();
  const t = type(x);
  let root = x;
  if (t === 'array') {
    root = [];
  } else if (t === 'object') {
    root = {};
  }

  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    }
  ];

    while(loopList.length) {
      const node = loopList.pop();
      const parent = node.parent;
      const key = node.key;
      const source = node.data;
      const tt = type(source);

      let target = parent;
      if (typeof key !== 'undefined') {
        target = parent[key] = tt === 'array' ? [] : {};
      }

      if (isClone(source)) {
        let uniqueTarget = uniqueData.get(source);
        if (uniqueTarget) {
          parent[key] = uniqueTarget;
          continue;
        }
        uniqueData.set(source, target);
    }
    if (tt === 'array') {
      for (let i = 0; i < source.length; i++) {
        if (isClone(source[i])) {
          loopList.push({
            parent: target,
            key: i,
            data: source[i],
          });
        } else {
          target[i] = source[i];
        }
      }
    } else if (tt === 'object'){
        for (let k in source) {
          if (hasOwnProp(source, k)) {
            if(k === UNIQUE_KEY) continue;
            if (isClone(source[k])) {
              loopList.push({
                parent: target,
                key: k,
                data: source[k],
              });
            } else {
            target[k] = source[k];
          }
         }
        }
      }
    }
    uniqueData.clear && uniqueData.clear();
    return root
}

export default clone