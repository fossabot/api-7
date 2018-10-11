import MeetupEventsService from '../services/MeetupEventsService'

class UpcomingEventsResolver {
  constructor(
    private meetupEventsService: MeetupEventsService = new MeetupEventsService()
  ) {}

  public resolve(): Promise<any> {
    return this.meetupEventsService.fetch('upcoming').then(events =>
      events.map(event => ({
        goingCount: event.yes_rsvp_count,
        time: new Date(event.time),
        url: event.link,
        venue: { ...event.venue, street: event.venue.address_1 },
      }))
    )
  }
}

export default UpcomingEventsResolver
