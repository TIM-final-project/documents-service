import * as dotenv from 'dotenv'

dotenv.config()

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'local'

//application
const PORT: number = +process.env.PORT || 14047

// typeorm
const environment = {
    local: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }
}
const TYPEORM = environment[NODE_ENV]

export {
    NODE_ENV,
    PORT,
    TYPEORM
}