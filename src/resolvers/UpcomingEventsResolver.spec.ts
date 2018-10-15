import IMeetupEventsService from '../services/IMeetupEventsService'
import UpcomingEventsResolver, { IMeetupEvent } from './UpcomingEventsResolver'

const mockEvents: IMeetupEvent[] = [
  {
    time: +Date.now(),
    yes_rsvp_count: 42,
    link: 'https://example.com/meetup-api',
    venue: {
      name: 'Fake Venue',
      lat: 4711,
      lon: 1337,
      country: 'de',
      city: 'Fake City',
      address_1: '123 Fake Street',
    },
  },
]

const retrieve = jest.fn().mockImplementation(async () => mockEvents)
const service: IMeetupEventsService = { retrieve }

describe('UpcomingEventsResolver', () => {
  let resolver

  beforeEach(() => {
    resolver = new UpcomingEventsResolver(service)
  })

  test('fetches data from IMeetupEventsService', async () => {
    await resolver.resolve()
    expect(retrieve).toHaveBeenCalledTimes(1)
  })

  test('converts IMeetupEvent to IEvent', async () => {
    const organizers = await resolver.resolve()
    const {
      link: url,
      yes_rsvp_count: goingCount,
      venue: { lat, lon, city, country, name, address_1: street },
    } = mockEvents[0]

    expect(organizers).toEqual([
      {
        date: expect.any(Date),
        goingCount,
        url,
        venue: {
          name,
          street,
          city,
          country,
          lat,
          lon,
        },
      },
    ])
  })
})
