import classNames from 'classnames'
import { DateTime, IANAZone } from 'luxon'
import { LaserTagEvent, LaserTagVenueId } from '../../../scraper/src/types'
import Chevron from './Chevron'
import styles from './EventListItem.module.scss'

const zone = IANAZone.create('Europe/Helsinki')

function capitalize(str: string): string {
  return str[0].toUpperCase() + str.substr(1)
}

function formatISODate(date: string): string {
  return DateTime.fromISO(date)
    .setZone(zone)
    .setLocale('fi')
    .toFormat(`EEE d.M.y 'klo' HH:mm`)
}

function fixEventTitle(title: string): string {
  return title
    .replace(' - Gp ry / Laser Tag Urheilijat Helsinki', '')
    .replace(' / Laser Tag Urheilijat Helsinki', '')
    .trim()
}

function CancelWarning({
  event,
  now = DateTime.local().setZone(zone)
}: {
  event: LaserTagEvent
  now?: DateTime
}) {
  const dt = DateTime.fromISO(event.startDate, { zone })
  return dt.hasSame(now, 'day') &&
    now.hour > 8 &&
    now.hour < 14 &&
    event.reservedSlots < 10 ? (
    <div className="mt-2 text-sm text-error-red">
      Puuttuu {10 - event.reservedSlots} pelaajaa – perutaan klo 14:00
    </div>
  ) : null
}

function Separator() {
  return <div className={styles.separator}></div>
}

function Venue({ venueId }: { venueId: LaserTagVenueId }) {
  const name = (() => {
    switch (venueId) {
      case 'hki':
        return 'Salmisaari'
      case 'vnt':
        return 'Flamingo'
    }
  })()

  const city = (() => {
    switch (venueId) {
      case 'hki':
        return `Helsinki`
      case 'vnt':
        return 'Vantaa'
    }
  })()

  return (
    <a href={`https://mz${venueId}.slsystems.fi/booking-entry/index`}>
      <div
        className={classNames(
          'text-white font-medium text-sm inline-flex px-1 rounded text-shadow-sm',
          styles.textShadow,
          {
            'bg-venue-blue': venueId === 'hki',
            'bg-venue-red': venueId === 'vnt'
          }
        )}
        title={`${name}, ${city}`}
      >
        {name}
      </div>
    </a>
  )
}

export default function EventListItem(event: LaserTagEvent) {
  const title = fixEventTitle(event.title)
  const description = (() => {
    switch (title) {
      case 'Kisapelaajien jäsenilta':
        return 'Vain kisapelaajille ja kisaamisesta kiinnostuneille kokeneille pelaajille'
      case 'Jäsenilta':
        return 'Kaikille avoin jäsenilta'
      case 'Uusien pelaajien peli-ilta':
        return 'Uusille ja aloitteleville pelaajille tarkoitettu jäsenilta'
    }
  })()
  return (
    <div className="flex flex-col pt-3 pb-4 border-b border-b-0 first:pt-0 border-black-f0">
      <a href={event.registrationUrl}>
        <div className="flex flex-row">
          <div className="flex-grow">
            <h2 className="text-2xl font-medium leading-none text-black text-black-333">
              {title}
            </h2>
            {description ? (
              <div className="mt-2 text-sm text-black-555">{description}</div>
            ) : null}
            <div className="flex items-center mt-1 text-black-222">
              {capitalize(formatISODate(event.startDate))}
              <Separator />
              {event.reservedSlots}/{event.maxSlots}
            </div>
            <div className="mt-2px">
              <Venue venueId={event.venueId} />
            </div>
            <CancelWarning event={event} />
          </div>
          <div className="flex items-center pr-2">
            <Chevron />
          </div>
        </div>
      </a>
    </div>
  )
}
