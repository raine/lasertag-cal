import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
// import { validDate } from './validDate'

export const LaserTagVenueId = t.keyof({
  hki: null,
  vnt: null
})

export type LaserTagVenueId = t.TypeOf<typeof LaserTagVenueId>

export const LaserTagEvent = t.type({
  startDate: t.string,
  eventId: NonEmptyString,
  title: NonEmptyString,
  maxSlots: t.number,
  reservedSlots: t.number,
  registrationUrl: NonEmptyString,
  venueId: LaserTagVenueId
})

export type LaserTagEvent = t.TypeOf<typeof LaserTagEvent>

export type LaserTagVenue = {
  id: LaserTagVenueId
  baseUrl: string
}

export type LaserTagAuth = { [k in LaserTagVenueId]: string }
