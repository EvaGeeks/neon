import { checkProjectExist } from './utils/index.js'

const init = (argv, answers) => {
  const cmdPth = process.cwd()
  const option = { ...argv, ...answers }
  const { name } = option
  const pathname = String(typeof argv._[1] !== 'undefined' ? argv._[1] : name)
  
  if (!pathname) {
    console.error("error: neon cli create need name")
    return
  }

  if (checkProjectExist(cmdPth, pathname)) {
    console.error("error: The library is already exist!")
    return
  }
}

export default init