import { HeroCountdownItem } from './HeroCountdownItem'
import { CountdownEvent } from '@/data/countdown-events'

interface HeroCountdownGroupProps {
  events: CountdownEvent[]
}

export function HeroCountdownGroup({ events }: HeroCountdownGroupProps) {
  if (events.length === 0) return null

  // If there's only 1 event, center it with a max width
  if (events.length === 1) {
    const event = events[0]
    return (
      <div className='flex w-full justify-center'>
        <div className='w-full max-w-3xl'>
          <HeroCountdownItem title={event.title} targetDate={new Date(event.targetDate)} />
        </div>
      </div>
    )
  }

  // If there are 2 events, show them side-by-side
  // On mobile they will stack
  return (
    <div className='grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12'>
      {events.slice(0, 2).map((event) => (
        <div key={event.id} className='w-full'>
          <HeroCountdownItem title={event.title} targetDate={new Date(event.targetDate)} />
        </div>
      ))}
    </div>
  )
}
