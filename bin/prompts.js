import inquirer from 'inquirer'
import validate from 'validate-npm-package-name'

const runInitPrompts =(pathname, argv) => {
  const { name } = argv
  const promptList = [
    {
      type: 'input',
      message: 'library name',
      name: 'name',
      default: pathname || name,
      validate: (val) => {
        if (!val) {
          return 'Please enter name'
        }
        if (val.match(/\s+/g)) {
          return 'Forbidden library name'
        }
        return true
      }
    },
    {
      type: 'input',
      message: 'npm package name',
      name: 'npmname',
      default: pathname || name,
      validate: (val) => {
        if (!validate(val).validForNewPackages) {
          return 'Forbidden npm name'
        }
        return true
      }
    },
    {
      type: 'input',
      message: 'github username',
      name: 'username',
      default: 'neno',
    },
    {
      type: 'confirm',
      name: 'prettier',
      message: 'use prettier?',
      default: true
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: 'use eslint?',
      default: true
    },
    {
      type: 'checkbox',
      message: 'use commitlint:',
      name: 'commitlint',
      choices: ['commitlint', 'standard-version'],
      default: ['commitlint'],
      filter: (values) => {
        return values.reduce((res, cur) => ({...res, [cur]: true}), {})
      }
    },
    {
      type: 'checkbox',
      message: 'use test',
      name: 'test',
      choices: ['jest', 'mocha'],
      default: ['jest'],
      filter: (values) => {
        return values.reduce((res, cur) => ({...res, [cur]: true}), {}) 
      }
    },
    {
      type: 'confirm',
      name: 'husky',
      message: 'use husky?',
      default: true
    },
    {
      type: 'list',
      name: 'ci',
      message: 'use ci:',
      choices: ['github', 'none'],
      filter: (values) => {
        return {
          github: 'github',
          none: null
        }[values]
      }
    }
  ]

  return inquirer.prompt(promptList)
}

export default runInitPrompts
