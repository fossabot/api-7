import { Server } from 'http'
import * as request from 'supertest'
import api from './api'

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

jest.mock('got', () =>
  jest.fn().mockImplementation(async url => {
    if (url === 'https://api.twitter.com/oauth2/token') {
      return { body: '{"access_token":"mockToken"}' }
    } else if (url.match(/^https:\/\/api\.meetup\.com\//)) {
      return {
        body: [
          {
            link: 'https://example.com/paderbornjs',
            time: +new Date(),
            venue: {
              name: 'Fake Venue',
              lat: 4711,
              lon: 1337,
              address_1: 'Fake street',
              city: 'Faketown',
              country: 'de',
            },
            yes_rsvp_count: 42,
          },
        ],
      }
    } else if (url.match(/^https:\/\/api\.github\.com\//)) {
      return {
        body: [
          {
            body: `##### John Doe
###### Research Engineer at Spacebook
###### [@johndoe](https://example.com/johndoe)

Issue 3`,
            labels: [],
            milestone: {
              due_on: tomorrow.toISOString(),
            },
            title: 'Fake title',
            user: {
              avatar_url: 'Fake URL',
            },
          },
        ],
      }
    } else if (url.match(/^https:\/\/api\.twitter\.com\//)) {
      return {
        body: [
          {
            name: 'John Doe',
            description: 'Fake description',
            screen_name: 'Fake screen name',
            profile_image_url_https: 'fake image URL',
          },
        ],
      }
    }
  })
)

describe('API', () => {
  let server: Server

  beforeAll(() => {
    server = api.listen(4000)
  })

  afterEach(() => {
    server.close()
  })

  test('returns requested data', async () => {
    const response = await request(api).get(
      '/?query={organizers{name},upcomingEvents{goingCount},upcomingTalks{title}}'
    )
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: {
        organizers: [{ name: 'John Doe' }],
        upcomingEvents: [{ goingCount: 42 }],
        upcomingTalks: [{ title: 'Fake title' }],
      },
    })
  })
})
