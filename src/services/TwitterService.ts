import EnvironmentHelper from '../utils/EnvironmentHelper'
import ServiceFetcher from '../utils/ServiceFetcher'

const BASE_URL = 'https://api.twitter.com'

let accessToken: string = null

class TwitterService {
  constructor(private fetcher: ServiceFetcher = new ServiceFetcher()) {}

  public async fetch(endpoint: string): Promise<any> {
    if (!accessToken) {
      const key = EnvironmentHelper.get('TWITTER_API_KEY')
      const secret = EnvironmentHelper.get('TWITTER_API_SECRET')

      const res = JSON.parse(
        await this.fetcher.fetch(`${BASE_URL}/oauth2/token`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString(
              'base64'
            )}`,
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
