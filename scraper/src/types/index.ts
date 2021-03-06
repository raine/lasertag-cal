import * as t from 'io-ts'
import { NonNegative } from './NonNegative'
import { NonEmptyString } from 'io-ts-types'
import { ValidUrl } from './ValidUrl'

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
  registrationUrl: ValidUrl,
  venueId: LaserTagVenueId
})

export type LaserTagEvent = t.TypeOf<typeof LaserTagEvent>

export type LaserTagVenue = {
  id: LaserTagVenueId
  baseUrl: string
}

export const LoginDetails = t.type({
  username: NonEmptyString,
  password: NonEmptyString
})

export type LoginDetails = t.TypeOf<typeof LoginDetails>

export type LaserTagAuth = { [k in LaserTagVenueId]: LoginDetails }
