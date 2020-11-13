import EventList from 'components/EventList'
import LtuhFacebookLink from 'components/LtuhFacebookLink'
import ky from 'ky/umd'
import { InferGetServerSidePropsType } from 'next'
import React, { useEffect, useState } from 'react'
import { LaserTagEvent } from '../../../scraper/src/types'

function getEvents(): Promise<LaserTagEvent[]> {
  return ky.get(process.env.NEXT_PUBLIC_API_URL + '/api/events').json()
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
      <h1 className="mb-4 text-lg border-b text-black-333">
        Tulevat jäsenillat
      </h1>
      <EventList events={events} />
      <LtuhFacebookLink />
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
