#!/usr/bin/env node

const { default: OAS } = require('oas-normalize')
const swaggerInline = require('swagger-inline')
const fs = require('fs')

const isDryRun = process.argv.indexOf('--dry-run') !== -1

function normalizeOAS(obj) {
  if (!obj) return

  if (Array.isArray(obj)) {
    obj.forEach((val) => normalizeOAS(val))
  } else if (typeof obj === 'object') {
    if (obj.hasOwnProperty('properties') && !obj.hasOwnProperty('type')) {
      obj.type = 'object'
    } else if (obj.hasOwnProperty('requestBody')) {
      obj.requestBody.required = true
    }

    Object.keys(obj).forEach((key) => normalizeOAS(obj[key]))
  }
}

// front API JSON format
swaggerInline(
  [
    './src/models/*.ts',
    './src/api/middlewares/**/*.ts',
    './src/api/routes/front/**/*.ts',
    './src/api/middlewares/**/*.ts',
  ],
  {
    base: './jvm-client/docs/front-spec-base.yaml',
    ignore: [],
    format: '.json',
  },
)
  .then((gen) => {
    const oas = new OAS(gen)

    oas
      .validate(true)
      .then(() => {
        if (!isDryRun) {
          const obj = JSON.parse(gen)

          // normalize generated oas
          normalizeOAS(obj)

          // write file
          fs.writeFileSync('./jvm-client/docs/front-spec.json', JSON.stringify(obj, null, 2))
        }
      })
      .catch((error) => {
        console.log('Error front gen sdk: ', error)
        process.exit(1)
      })
  })
  .catch((error) => {
    console.log('Error front gen sdk: ', error)
    process.exit(1)
  })

// front API yaml format
swaggerInline(
  [
    './src/models/*.ts',
    './src/api/middlewares/**/*.ts',
    './src/api/routes/front/**/*.ts',
    './src/api/middlewares/**/*.ts',
  ],
  {
    base: './jvm-client/docs/front-spec-base.yaml',
    ignore: [],
    format: '.yaml',
  },
)
  .then((gen) => {
    if (!isDryRun) {
      // write file
      fs.writeFileSync('./jvm-client/docs/front-spec.yaml', gen)
    }
  })
  .catch((error) => {
    console.log('Error front gen sdk: ', error)
    process.exit(1)
  })
