import got from 'got'
import { DateTime } from 'luxon'
import { Logger } from 'pino'
import { CookieJar } from 'tough-cookie'
import { compatCookieJar } from './compat-cookie-jar'
import { parseEventsHtml } from './parse'
import { login } from './session'
import { LaserTagAuth, LaserTagEvent, LaserTagVenue } from './types'

export const VENUES: LaserTagVenue[] = [
  { id: 'hki' as const, baseUrl: 'https://mzhki.slsystems.fi' },
  { id: 'vnt' as const, baseUrl: 'https://mzvnt.slsystems.fi' }
]

function formatEventsUrl(venue: LaserTagVenue): string {
  return venue.baseUrl + '/booking-entry/index'
}

const getVenueEvents = (
  auth: LaserTagAuth,
  cookieJar: CookieJar,
  log: Logger
) => (venue: LaserTagVenue): Promise<LaserTagEvent[]> =>
  getEventsListHtml(
    auth,
    cookieJar,
    log
  )(venue, 1).then((html) => parseEventsHtml(venue, html))

const getEvents = (
  getVenueEventsWithAuth: (venue: LaserTagVenue) => Promise<LaserTagEvent[]>
): Promise<LaserTagEvent[]> =>
  Promise.all(VENUES.map(getVenueEventsWithAuth)).then((xs) =>
    xs
      .flat()
      .sort(
        (a, b) =>
          DateTime.fromISO(a.startDate).toMillis() -
          DateTime.fromISO(b.startDate).toMillis()
      )
  )

const getEventsListHtml = (
  auth: LaserTagAuth,
  cookieJar: CookieJar,
  log: Logger
) => async (venue: LaserTagVenue, attempt = 1): Promise<string> => {
  log.info({ venue, attempt }, 'getting events list html')
  const tryLogin = async () => {
    const { username, password } = auth[venue.id]
    await login(log, cookieJar, venue, username, password)
  }
  const url = formatEventsUrl(venue)
  const hasLoginCookie = cookieJar
    .getCookieStringSync(venue.baseUrl)
    .includes('_identity')
  if (!hasLoginCookie) {
    log.info({ venue }, 'no session in cookie jar; logging in')
    await tryLogin()
  }
  log.info(`fetching ${url}`)
  const res = await got(url, {
    cookieJar: compatCookieJar(cookieJar) as CookieJar
  })
  if (res.redirectUrls[0]?.includes('/login')) {
    if (attempt >= 2) throw new Error('still redirected to login')
    log.info({ venue }, 'session expired')
    await tryLogin()
    return getEventsListHtml(auth, cookieJar, log)(venue, attempt + 1)
  } else {
    return res.body
  }
}

export default function init(
  auth: LaserTagAuth,
  cookieJar: CookieJar,
  log: Logger
) {
  return {
    getEvents: () => getEvents(getVenueEvents(auth, cookieJar, log))
  }
}
