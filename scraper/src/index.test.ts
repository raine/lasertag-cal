import { back as nockBack } from 'nock'
import pino from 'pino'
import { CookieJar } from 'tough-cookie'
import Scraper from './'
import { LaserTagAuth } from './types'

const log = pino()
const auth = require('../test/data/auth.json') as LaserTagAuth

test('no session', async () => {
  const { nockDone } = await nockBack('test1.json')
  const cookieJar = new CookieJar()
  const scraper = Scraper(auth, cookieJar, log)
  const events = await scraper.getEvents()
  nockDone()
  expect(events.length).toBeGreaterThan(0)
})

test('existing invalid session', async () => {
  const cookies = require('../test/data/invalid-cookies.json')
  const cookieJar = CookieJar.fromJSON(cookies)
  const { nockDone } = await nockBack('test2.json')
  const scraper = Scraper(auth, cookieJar, log)
  const events = await scraper.getEvents()
  nockDone()
  expect(events.length).toBeGreaterThan(0)
})
