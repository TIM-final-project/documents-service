import * as dotenv from 'dotenv'

dotenv.config()

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'dev'

//application
const PORT: number = +process.env.PORT || 3003

// typeorm
const typeorm_default = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}

const typeorm_conf = {
  dev: {
    ...typeorm_default,
    synchronize: true,
    logging: true,
  },
  production: {
    ...typeorm_default,
    synchronize: false,
    logging: false,
  },
};

const TYPEORM = typeorm_conf[NODE_ENV];

const NEW_RELIC_LICENSE_KEY = process.env.NEW_RELIC_LICENSE_KEY;
const NEW_RELIC_APP_NAME = process.env.NEW_RELIC_APP_NAME;

export {
    NODE_ENV,
    PORT,
    TYPEORM,
    NEW_RELIC_APP_NAME,
    NEW_RELIC_LICENSE_KEY
}