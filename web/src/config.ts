import * as t from 'io-ts'
import * as path from 'path'
import * as fs from 'fs'
import { formatValidationErrors } from 'io-ts-reporters'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

const Config = t.type({
  scraperCookies: t.type({
    hki: t.string,
    vnt: t.string
  }),
  port: t.number
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
