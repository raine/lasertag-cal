import * as t from 'io-ts'
import { NonNegative } from './NonNegative'
import { NonEmptyString } from 'io-ts-types'

export const LaserTagVenueId = t.keyof({
  hki: null,
  vnt: null
})

export type LaserTagVenueId = t.TypeOf<typeof LaserTagVenueId>

export const LaserTagEvent = t.type({
  startDate: NonEmptyString,
  eventId: NonEmptyString,
  title: NonEmptyString,
  maxSlots: NonNegative,
  reservedSlots: NonNegative,
  registrationUrl: NonEmptyString,
  venueId: LaserTagVenueId
})

export type LaserTagEvent = t.TypeOf<typeof LaserTagEvent>

export type LaserTagVenue = {
  id: LaserTagVenueId
  baseUrl: string
}

export type LaserTagAuth = { [k in LaserTagVenueId]: string }
