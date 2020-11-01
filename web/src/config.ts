import * as t from 'io-ts'
import * as path from 'path'
import * as fs from 'fs'
import { formatValidationErrors } from 'io-ts-reporters'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString'
import { LoginDetails } from '../../scraper/src/types'

const Config = t.type({
  scraperLoginDetails: t.type({
    hki: LoginDetails,
    vnt: LoginDetails
  }),
  port: t.number,
  sentryDsn: t.union([NonEmptyString, t.undefined])
})

type Config = t.TypeOf<typeof Config>

const configPath =
  process.env.LASERTAG_CAL_CONFIG ??
  path.join(__dirname, '..', '..', 'config.json')

if (!configPath) throw new Error(`Config path not set`)

const json = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const result = Config.decode(json)
const config = pipe(
  result,
  fold(
    (errors) => {
      throw new Error(formatValidationErrors(errors).join('\n'))
    },
    (val) => val
  )
)

export default config as Config
