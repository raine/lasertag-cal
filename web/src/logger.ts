import pino from 'pino'

const OPTS = { ignore: 'pid,hostname,time' }

const logger = pino({
  prettyPrint: process.env.NODE_ENV !== 'production' ? OPTS : false
})

export default logger
