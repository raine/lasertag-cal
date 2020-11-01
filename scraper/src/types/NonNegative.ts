import * as t from 'io-ts'

interface NonNegativeBrand {
  readonly NonNegative: unique symbol
}
export const NonNegative = t.brand(
  t.number,
  (n): n is t.Branded<number, NonNegativeBrand> => n >= 0,
  'NonNegative'
)

export type NonNegative = t.TypeOf<typeof NonNegative>
