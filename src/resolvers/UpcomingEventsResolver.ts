import MeetupEventsService from '../services/MeetupEventsService'

class UpcomingEventsResolver {
  constructor(
    private meetupEventsService: MeetupEventsService = new MeetupEventsService()
  ) {}

  public resolve(): Promise<any> {
    return this.meetupEventsService.fetch('upcoming').then(events =>
      events.map(event => ({
        date: new Date(event.time),
        goingCount: event.yes_rsvp_count,
        url: event.link,
        venue: { ...event.venue, street: event.venue.address_1 },
      }))
    )
  }
}

export default UpcomingEventsResolver
