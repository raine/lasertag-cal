import classNames from 'classnames'
import { DateTime } from 'luxon'
import { LaserTagEvent, LaserTagVenueId } from '../../../scraper/src/types'
import Chevron from './Chevron'
import styles from './EventListItem.module.scss'

function capitalize(str: string): string {
  return str[0].toUpperCase() + str.substr(1)
}

function formatISODate(date: string): string {
  return DateTime.fromISO(date)
    .setLocale('fi')
    .toFormat(`EEE d.M.y 'klo' HH:mm`)
}

function fixEventTitle(title: string): string {
  return title
    .replace(' - Gp ry / Laser Tag Urheilijat Helsinki', '')
    .replace(' / Laser Tag Urheilijat Helsinki', '')
    .trim()
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

  return (
    <div
      className={classNames(
        'text-white font-medium text-sm inline-flex px-1 rounded text-shadow-sm',
        styles.textShadow,
        {
          'bg-venue-blue': venueId === 'hki',
          'bg-venue-red': venueId === 'vnt'
        }
      )}
    >
      {name}
    </div>
  )
}

export default function EventListItem(event: LaserTagEvent) {
  return (
    <div className="flex flex-col pt-3 pb-4 border-b border-b-0 first:pt-0 border-black-f0">
      <a href={event.registrationUrl}>
        <div className="flex flex-row">
          <div className="flex-grow">
            <h2 className="text-2xl font-medium leading-none text-black text-black-333">
              {fixEventTitle(event.title)}
            </h2>
            <div className="flex items-center mt-1 text-black-222">
              {capitalize(formatISODate(event.startDate))}
              <Separator />
              {event.reservedSlots}/{event.maxSlots}
            </div>
            <div className="mt-2px">
              <Venue venueId={event.venueId} />
            </div>
          </div>
          <div className="flex items-center pr-2">
            <Chevron />
          </div>
        </div>
      </a>
    </div>
  )
}
