import TwitterService from '../services/TwitterService'

class TwitterResolver {
  constructor(private twitterService: TwitterService = new TwitterService()) {}

  public resolve(usernames: string[]): Promise<any> {
    return this.twitterService
      .fetch(`users/lookup.json?screen_name=${usernames.join(',')}`)
      .then(users =>
        users.map(user => ({
          name: user.name,
          description: user.description,
          twitter: {
            name: user.screen_name,
            profileImageUrl: user.profile_image_url_https.replace(
              /_normal/,
              ''
            ),
          },
        }))
      )
  }
}

export default TwitterResolver
