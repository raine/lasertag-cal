import { pipe } from 'fp-ts/lib/pipeable'
import { fold } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import { failure } from 'io-ts/lib/PathReporter'

export default function decodeOrThrow<A, I>(codec: t.Type<A>, value: I): A {
  return pipe(
    codec.decode(value),
    fold(
      (errors) => {
        throw Error(failure(errors).join('\n'))
      },
      (x) => x
    )
  )
}
