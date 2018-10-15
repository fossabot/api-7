import { IEvent } from '../schema'
import IMeetupEventsService from '../services/IMeetupEventsService'

export interface IMeetupEvent {
  link: string
  time: number
  venue: {
    name: string
    lat: number
    lon: number
    address_1: string
    city: string
    country: string
  }
  yes_rsvp_count: number
}

export default class UpcomingEventsResolver {
  constructor(private meetupEventsService: IMeetupEventsService) {}

  public resolve(): Promise<IEvent[]> {
    return this.meetupEventsService
      .retrieve('upcoming')
      .then(events => events.map(this.convertMeetupEventToEvent))
  }

  private convertMeetupEventToEvent({
    time,
    yes_rsvp_count: goingCount,
    link: url,
    venue: { name, lat, lon, address_1: street, city, country },
  }: IMeetupEvent): IEvent {
    return {
      date: new Date(time),
      goingCount,
      url,
      venue: { name, lat, lon, street, city, country },
    }
  }
}
