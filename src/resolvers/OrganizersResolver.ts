import { IOrganizer } from '../schema'
import ITwitterUsersService from '../services/ITwitterUsersService'

const organizerHandles = ['code_punkt']

export interface ITwitterUser {
  name: string
  description: string
  screen_name: string
  profile_image_url_https: string
}

export default class OrganizersResolver {
  constructor(private twitterUsersService: ITwitterUsersService) {}

  public resolve(): Promise<IOrganizer[]> {
    return this.twitterUsersService
      .retrieve(organizerHandles)
      .then(organizers => organizers.map(this.convertTwitterUserToOrganizer))
  }

  private convertTwitterUserToOrganizer(organizer: ITwitterUser): IOrganizer {
    return {
      name: organizer.name,
      description: organizer.description,
      twitter: {
        name: organizer.screen_name,
        profileImageUrl: organizer.profile_image_url_https.replace(
          /_normal/,
          ''
        ),
      },
    }
  }
}
