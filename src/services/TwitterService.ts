import ServiceFetcher from '../utils/ServiceFetcher'

const BASE_URL = 'https://api.twitter.com'
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env

let accessToken: string = null

class TwitterService {
  constructor(private fetcher: ServiceFetcher = new ServiceFetcher()) {}

  public async fetch(endpoint: string): Promise<any> {
    if (!accessToken) {
      console.log(
        'Authorization',
        TWITTER_CONSUMER_KEY,
        TWITTER_CONSUMER_SECRET
      )

      const res = JSON.parse(
        await this.fetcher.fetch(`${BASE_URL}/oauth2/token`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${TWITTER_CONSUMER_KEY}:${TWITTER_CONSUMER_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: 'grant_type=client_credentials',
          json: false,
        })
      )

      accessToken = res.access_token
    }

    return this.fetcher.fetch(`${BASE_URL}/1.1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
}

export default TwitterService
