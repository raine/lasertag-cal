import React from 'react'
import { LaserTagEvent } from '../../../scraper/src/types'
import EventListItem from './EventListItem'
import LtuhFacebookLink from './LtuhFacebookLink'

type Props = {
  events: LaserTagEvent[]
}

export default function EventList({ events }: Props) {
  return (
    <div>
      {events.length
        ? events
            .filter((event) => event.title.match(/jäsenilta|peli-ilta/i))
            .map((event) => <EventListItem key={event.eventId} {...event} />)
        : null}
      {!events.length ? (
        <div className="pt-4 pb-2 text-2xl text-center text-black-333">
          Ei pelejä kalenterissa.
        </div>
      ) : null}
      <LtuhFacebookLink />
    </div>
  )
}
