import React from 'react'
import { LaserTagEvent } from '../../../scraper/src/types'
import EventListItem from './EventListItem'

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
        <div className="pb-4 text-2xl text-center border-b text-black-333">
          Ei pelejä kalenterissa
        </div>
      ) : null}
    </div>
  )
}
