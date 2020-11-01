import * as t from 'io-ts'
import { fromRefinement } from 'io-ts-types'

function isValidUrl(val: unknown): val is string {
  try {
    new URL(val as string)
    return true
  } catch (err) {
    return false
  }
}

export interface ValidUrlC extends t.Type<string, string, unknown> {}

export const ValidUrl: ValidUrlC = fromRefinement('ValidUrl', isValidUrl)
