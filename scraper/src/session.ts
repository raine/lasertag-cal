import got from 'got'
import cheerio from 'cheerio'
import { CookieJar } from 'tough-cookie'
import { LaserTagVenue } from './types'
import { Logger } from 'pino'
import { compatCookieJar } from './compat-cookie-jar'

export async function login(
  log: Logger,
  cookieJar: CookieJar,
  venue: LaserTagVenue,
  username: string,
  password: string
) {
  // https://github.com/sindresorhus/got/issues/1082
  let res = await got(venue.baseUrl + '/site/login', {
    cookieJar: compatCookieJar(cookieJar) as CookieJar
  })
  const $ = cheerio.load(res.body)
  const csrfToken = $('input[name="_front1csrf"]').attr('value')!.trim()
  res = await got(venue.baseUrl + '/site/login', {
    method: 'POST',
    form: {
      _front1csrf: csrfToken,
      'LoginFormFront[username]': username,
      'LoginFormFront[password]': password,
      'LoginFormFront[rememberMe]': 1
    },
    cookieJar: compatCookieJar(cookieJar) as CookieJar
  })

  if (!cookieJar.getCookieStringSync(venue.baseUrl).includes('_identity')) {
    throw new Error('login failed')
  } else {
    log.info('logged in')
    return cookieJar
  }
}
