import IServiceFetcher from '../utils/IServiceFetcher'
import ITwitterUsersService from './ITwitterUsersService'

let accessToken: string = null

export default class TwitterUsersService implements ITwitterUsersService {
  public static BASE_URL = 'https://api.twitter.com/1.1/users'
  public static TOKEN_URL = 'https://api.twitter.com/oauth2/token'

  constructor(
    private apiKey: string,
    private apiSecret: string,
    private fetcher: IServiceFetcher
  ) {}

  public async retrieve(twitterHandles: string[]): Promise<any> {
    if (!accessToken) {
      const res = JSON.parse(
        await this.fetcher.fetch(TwitterUsersService.TOKEN_URL, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.apiKey}:${this.apiSecret}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: 'grant_type=client_credentials',
          json: false,
        })
      )

      accessToken = res.access_token
    }

    return this.fetcher.fetch(
      `${
        TwitterUsersService.BASE_URL
      }/lookup.json?screen_name=${twitterHandles.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
  }
}
