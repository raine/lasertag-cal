import config from './config'
import { CookieJar } from 'tough-cookie'
const Sentry = require('@sentry/node')
Sentry.init({ dsn: config.sentryDsn, tracesSampleRate: 1.0 })
import express from 'express'
import next from 'next'
import got from 'got'
import Scraper from '../../scraper/src'
import log from './logger'
import cacheableResponse from 'cacheable-response'
import pMemoize from './p-memoize'
import { LaserTagEvent } from '../../scraper/src/types'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = config.port
const cookieJar = new CookieJar()
const scraper = Scraper(config.scraperLoginDetails, cookieJar, log)

const getEventsMemoized1m = pMemoize(scraper.getEvents, 1000 * 60)

let cachedEvents: LaserTagEvent[] = []

// Hack from https://github.com/vercel/next.js/issues/16725
const ssrCache = (cacheableResponse as any)({
  ttl: 1000 * 60 * 10,
  get: async ({ req, res }: any) => {
    const rawResEnd = res.end
    const data = await new Promise<void>((resolve) => {
      res.end = (payload: any) => {
        if (res.statusCode === 200) {
          resolve(payload)
        } else {
          resolve()
        }
      }
      app.render(req, res, req.path, {
        ...req.query,
        ...req.params
      })
    })
    res.end = rawResEnd
    return { data }
  },
  send: ({ data, res }: any) => res.send(data)
})

app.prepare().then(() => {
  const server = express()

  server.get('/api/events', async (req, res) => {
    log.info('call to /api/events')
    try {
      cachedEvents = await getEventsMemoized1m()
    } catch (err) {
      Sentry.captureException(err)
      log.error(err)
      res.sendStatus(500)
    } finally {
      res.send(cachedEvents)
    }
  })

  server.get('/', (req, res) =>
    dev ? handle(req, res) : ssrCache({ req, res })
  )
  server.get('*', (req, res) => handle(req, res))
  server.listen(port, () => {
    log.info(`ready on http://localhost:${port}`)
  })

  async function cacheWarmupLoop() {
    const res = await got(`http://localhost:${port}/`)
    const maxAge = res.headers['cache-control']?.match(/max-age=(\d+)/)?.[1]
    if (maxAge) setTimeout(cacheWarmupLoop, (parseInt(maxAge) + 1) * 1000)
  }

  if (!dev) cacheWarmupLoop()

  process.on('SIGTERM', () => {
    log.info('received SIGTERM')
    process.exit(0)
  })
})

process.on('unhandledRejection', (err: any) => {
  log.error(err, 'unhandled rejection')
  Sentry.captureException(err)
})
