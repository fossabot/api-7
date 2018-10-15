import MeetupEventsService from './MeetupEventsService'

const mockEvents = [{ goingCount: 42 }]

describe('MeetupEventsService', () => {
  test('fetches event information from Meetup API', async () => {
    const fetch = jest.fn().mockImplementation(async () => mockEvents)
    const service = new MeetupEventsService('meetupKey', { fetch })
    const result = await service.retrieve('upcoming')

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      `${MeetupEventsService.BASE_URL}/events?status=upcoming&key=meetupKey`
    )
    expect(result).toEqual(mockEvents)
  })
})
