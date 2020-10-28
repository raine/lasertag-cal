import * as t from 'io-ts'
import { fromRefinement } from 'io-ts-types'

function isValidDate(u: unknown): u is Date {
  return u instanceof Date && !isNaN((u as unknown) as number)
}

export interface ValidDateC extends t.Type<Date, Date, unknown> {}

export const validDate: ValidDateC = fromRefinement('ValidDate', isValidDate)
