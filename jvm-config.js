const dotenv = require("dotenv-safe");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// db
const DATABASE_TYPE = process.env.DATABASE_TYPE || "postgres";
const DATABASE_LOGGING = process.env.DATABASE_LOGGING || false;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/jvm-development";

const HTTP_LOGGING = process.env.HTTP_LOGGING === 'true'

/** @type {import('./nodejs-package-starter/dist').ConfigModule['projectConfig']} */
const projectConfig = {
     port: 9000,
     redis_url: REDIS_URL,
     database_type: DATABASE_TYPE,
     database_url: DATABASE_URL,
     database_logging: DATABASE_LOGGING,
     http_logging: HTTP_LOGGING
}

/** @type {import('./nodejs-package-starter/dist').ConfigModule} */
module.exports = {
    projectConfig
}