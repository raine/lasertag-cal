import { LaserTagEvent } from '../../../scraper/src/types'
import { InferGetServerSidePropsType } from 'next'
import ky from 'ky/umd'
import React, { useEffect, useState } from 'react'
import EventList from 'components/EventList'

function getEvents(): Promise<LaserTagEvent[]> {
  return ky.get('http://localhost:3000/api/events').json()
}

export default function Index(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [events, setEvents] = useState<LaserTagEvent[]>(props.events)

  useEffect(() => {
    getEvents().then(setEvents)
  }, [])

  return (
    <div className="p-4 bg-white sm:m-auto sm:shadow-xl sm:max-w-lg sm:pt-8">
      <EventList events={events} />
    </div>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {
      events: await getEvents()
    }
  }
}
