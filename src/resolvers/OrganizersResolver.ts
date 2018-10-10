import TwitterService from '../services/TwitterService'

const organizers: string[] = ['code_punkt']

class OrganizersResolver {
  constructor(private twitterService: TwitterService = new TwitterService()) {}

  public resolve(): Promise<any> {
    return this.twitterService
      .fetch(`users/lookup.json?screen_name=${organizers.join(',')}`)
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

export default OrganizersResolver
