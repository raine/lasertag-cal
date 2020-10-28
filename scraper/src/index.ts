import got from 'got'
import cheerio from 'cheerio'
import { DateTime, IANAZone } from 'luxon'
import decodeOrThrow from './decode-or-throw'
import { LaserTagAuth, LaserTagEvent, LaserTagVenue } from './types'
import { Logger } from 'pino'

export const VENUES: LaserTagVenue[] = [
  { id: 'hki' as const, baseUrl: 'https://mzhki.slsystems.fi' },
  { id: 'vnt' as const, baseUrl: 'https://mzvnt.slsystems.fi' }
]

const zone = IANAZone.create('Europe/Helsinki')

function formatEventsUrl(venue: LaserTagVenue): string {
  return venue.baseUrl + '/booking-entry/index'
}

const getVenueEvents = (auth: LaserTagAuth, log: Logger) => (
  venue: LaserTagVenue
): Promise<LaserTagEvent[]> =>
  getEventsListHtml(
    auth,
    log
  )(venue).then((html) => parseEventsHtml(venue, html))

const getEvents = (
  getVenueEventsWithAuth: (venue: LaserTagVenue) => Promise<LaserTagEvent[]>
): Promise<LaserTagEvent[]> =>
  Promise.all(VENUES.map(getVenueEventsWithAuth)).then((xs) => xs.flat())

const getEventsListHtml = (auth: LaserTagAuth, log: Logger) => async (
  venue: LaserTagVenue
): Promise<string> => {
  const url = formatEventsUrl(venue)
  log.info(`fetching ${url}`)
  return (
    await got(url, {
      headers: {
        Cookie: auth[venue.id]
      }
    })
  ).body
}

export function parseEventsHtml(
  venue: LaserTagVenue,
  html: string
): LaserTagEvent[] {
  const $ = cheerio.load(html)
  const headers = $('.site-tapahtuma-list h4')
  return headers
    .map((i, elem) => {
      const title = $(elem).text().trim()
      const elems = $(elem).nextUntil('h4')
      const startDateElem = elems.find('.visible-xs:contains("Aika")').next()
      const startDateText = startDateElem.text().trim()
      const slotsElem = elems.find('.visible-xs:contains("Paikat")').next()
      const startDateTime = DateTime.fromFormat(
        startDateText.slice(3),
        "dd.MM.yyyy 'klo' HH:mm",
        { zone }
      )
      // Remove the list of participants wrapped in <i>
      slotsElem.find('i').remove()
      const slotsText = slotsElem.text().trim()
      const freeSlots = parseInt(
        slotsText.match(/Vapaana: (\d+)/)?.[1] as string
      )
      const reservedSlots = parseInt(
        slotsText.match(/Varattuna: (\d+)/)?.[1] as string
      )
      const registerBtnElem = elems.find('a:contains("Ilmoittaudu")')
      const registrationPath = registerBtnElem.attr('href')!
      const eventId = registrationPath.match(/(\d+)$/)?.[1]
      return decodeOrThrow(LaserTagEvent as any, {
        venueId: venue.id,
        eventId: eventId,
        title,
        startDate: startDateTime.toISO(),
        reservedSlots,
        maxSlots: freeSlots + reservedSlots,
        registrationUrl: venue.baseUrl + registrationPath
      })
    })
    .get()
}

export default function init(auth: LaserTagAuth, log: Logger) {
  const _getVenueEvents = getVenueEvents(auth, log)

  return {
    getVenueEvents: _getVenueEvents,
    getEvents: () => getEvents(_getVenueEvents)
  }
}
