import { back as nockBack } from 'nock'
import pino from 'pino'
const log = pino()
import { CookieJar } from 'tough-cookie'
import { VENUES } from './'
import { login } from './session'

describe('login', () => {
  test('works', async () => {
    const cookieJar = new CookieJar()
    const { nockDone } = await nockBack('login.json')
    const venue = VENUES[0]
    await login(log, cookieJar, venue, 'foo', 'bar')
    nockDone()
    const cookie = cookieJar.getCookieStringSync(venue.baseUrl)
    expect(cookie).toContain('_identity')
  })
})
