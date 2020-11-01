import { CookieJar } from 'tough-cookie'

// https://github.com/sindresorhus/got/issues/1082
export const compatCookieJar = (cookieJar: CookieJar) => ({
  setCookie: (rawCookie: string, url: string) =>
    new Promise((resolve, reject) =>
      cookieJar.setCookie(rawCookie, url, (err, value) =>
        err ? reject(err) : resolve(value)
      )
    ),
  getCookieString: async (url: string) =>
    new Promise((resolve, reject) =>
      cookieJar.getCookieString(url, (err, value) =>
        err ? reject(err) : resolve(value)
      )
    )
})
