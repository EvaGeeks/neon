import fs from 'fs'
import path from 'path'

const checkProjectExist = (cmdPath, name) => {
  return fs.existsSync(path.resolve(cmdPath, name))
}

export default checkProjectExist