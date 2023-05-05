#!/usr/bin/env node

const { default: OAS } = require('oas-normalize')
const swaggerInline = require('swagger-inline')

const isDryRun = process.argv.indexOf('--dry-run') !== -1

// front API
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
