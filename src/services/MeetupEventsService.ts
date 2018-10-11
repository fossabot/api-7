import EnvironmentHelper from '../utils/EnvironmentHelper'
import ServiceFetcher from '../utils/ServiceFetcher'

const BASE_URL = 'https://api.meetup.com'
const MEETUP_NAME = 'paderborn-js'

let meetupKey: string = EnvironmentHelper.get('MEETUP_KEY')

class MeetupEventsService {
  constructor(private fetcher: ServiceFetcher = new ServiceFetcher()) {}

  public async fetch(eventStatus: string): Promise<any> {
    return this.fetcher.fetch(
      `${BASE_URL}/${MEETUP_NAME}/events?status=${eventStatus}&key=${meetupKey}`
    )
  }
}

export default MeetupEventsService
