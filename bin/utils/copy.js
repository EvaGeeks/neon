import copydir from "copy-dir"
import fs from 'fs'
import path from 'path'
import template from "template_js"
import extend from './extend.js'
const copyDir = (from, to, options) => {
  copydir.sync(from, to, options)
}

const copyFile = (from, to) => {
  const buffer = fs.readFileSync(from)
  const parentPath = path.dir(to)
  mkdirSyncGuard(parentPath)
  fs.writeFileSync(to, buffer)
}

const mkdirSyncGuard = (target) => {
  if (!fs.existsSync(parentPath)) {
    try {
      fs.mkdirSync(target, { recursive: true })
    } catch (error) {
      const mkdirp = (target) => {
        if (fs.existsSync(target)) {
          return true
        }
        const dirname = path.dirname(dir)
        mkdirp(dirname)
        fs.mkdirSync(dir)
      }
      mkdirp(target)
    }
  }
}

const copyTmpl = (from, to, data) => {
  if (path.extname(from) !== '.tmpl') {
    return copyFile(from, to)
  }
  const parentPath = path.dirname(to)
  mkdirSyncGuard(parentPath)
  fs.writeFileSync(to, readTmpl(from ,data), { encoding : true })
}

const readTmpl = (from, data = {}) => {
  const text = fs.readFileSync(from ,{ encoding: true })
  return template(text, data)
}

const mergeObj2JSON = (object, to) => {
  const json = JSON.parse(fs.readFileSync(to, { encoding: true }))
  extend(json, object)
  fs.writeFileSync(to, JSON.stringify(json, null, 2), { encoding: 'utf-8' })
}

const mergeJSON2JSON = (from , to) => {
  const json =  JSON.parse(fs.readFileSync(from , { encoding: 'utf-8' }))
  mergeObj2JSON(json, to)
}

const mergeTmpl2JSON = (from , to, data = {}) => {
  const json = JSON.parse(readTmpl(from, to))
  mergeObj2JSON(json, to)
}

const replaceFileText = (filepath, replacerList) => {
  let file = fs.readFileSync(filepath, {encoding: 'utf8'});
  let count = 0;
  replacerList.forEach(function (replacer) {
    let res;
    while(res = file.match(replacer.from)) {
      count += 1;
      var to = typeof replacer.to === 'function'
        ? replacer.to
        : replacer.to.replace(/\$(\d+)/g, function (match, p1) {
            return res[p1] || ''
        });

      file = file.replace(replacer.from, to);
    }
  })
  if (count) {
    fs.writeFileSync(filepath, file);
  }
}

export {
  copyDir,
  copyFile,
  mkdirSyncGuard,
  copyTmpl,
  readTmpl,
  mergeJSON2JSON,
  mergeTmpl2JSON,
  replaceFileText
}