import IServiceFetcher from '../utils/IServiceFetcher'

export default class MeetupEventsService {
  // public static BASE_URL = 'https://api.meetup.com/paderborn-js'
  public static BASE_URL = 'https://api.meetup.com/IT-Flash-Paderborn'

  constructor(private meetupKey: string, private fetcher: IServiceFetcher) {}

  public async retrieve(eventStatus: string): Promise<any> {
    return this.fetcher.fetch(
      `${MeetupEventsService.BASE_URL}/events?status=${eventStatus}&key=${
        this.meetupKey
      }`
    )
  }
}
