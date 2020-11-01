import { parseEventsHtml } from './parse'
import { VENUES } from './'
import * as path from 'path'
import { promises as fs } from 'fs'

test('parseEventsHtml', async () => {
  const venue = VENUES[1]
  const html = await fs.readFile(
    path.join(__dirname, '..', 'test', 'data', 'mzvnt.html'),
    'utf8'
  )

  expect(parseEventsHtml(venue, html)).toEqual([
    {
      eventId: '80778',
      maxSlots: 33,
      registrationUrl:
        'https://mzvnt.slsystems.fi/booking-entry/create?id=80778',
      reservedSlots: 1,
      startDate: '2020-10-20T19:00:00.000+03:00',
      title: 'Jäsenilta / Laser Tag Urheilijat Helsinki',
      venueId: 'vnt'
    },
    {
      eventId: '80776',
      maxSlots: 36,
      registrationUrl:
        'https://mzvnt.slsystems.fi/booking-entry/create?id=80776',
      reservedSlots: 0,
      startDate: '2020-10-22T20:00:00.000+03:00',
      title: 'Kisapelaajien jäsenilta / Laser Tag Urheilijat Helsinki',
      venueId: 'vnt'
    },
    {
      eventId: '80777',
      maxSlots: 36,
      registrationUrl:
        'https://mzvnt.slsystems.fi/booking-entry/create?id=80777',
      reservedSlots: 0,
      startDate: '2020-10-29T20:00:00.000+02:00',
      title: 'Kisapelaajien jäsenilta / Laser Tag Urheilijat Helsinki',
      venueId: 'vnt'
    }
  ])
})
