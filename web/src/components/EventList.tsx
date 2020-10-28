import React from 'react'
import EventListItem from './EventListItem'
import { LaserTagEvent } from '../../../scraper/src/types'

type Props = {
  events: LaserTagEvent[]
}

export default function EventList({ events }: Props) {
  return (
    <div>
      {events.map((event) => (
        <EventListItem key={event.eventId} {...event} />
      ))}
    </div>
  )
}
