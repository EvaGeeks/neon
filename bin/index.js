#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import runInitPrompts from './prompts.js'
import init from './init.js'

yargs(hideBin(process.argv))
  .usage('usage: neon [options]')
  .usage('usage: neon <command> [options]')
  .example('neon new library', '新建一个库')
  .alias('h', 'help')
  .alias('v', 'version')
  .command(
    ['new', 'n'],
    '新建一个项目', 
    () => {},
    (argv) => {
      runInitPrompts(argv._[1], argv).then(answers => {
        init(argv, answers)
      })
    }
  )
  .epilog('copyright 2023-present')
  .demandCommand()
  .argv