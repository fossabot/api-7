import ITwitterService from '../services/ITwitterUsersService'
import OrganizersResolver, { ITwitterUser } from './OrganizersResolver'

const mockUsers: ITwitterUser[] = [
  {
    name: 'John Doe',
    description: 'Lorem Ipsum',
    screen_name: 'johndoe',
    profile_image_url_https: 'https://example.com/profile_normal.jpg',
  },
]

const retrieve = jest.fn().mockImplementation(async () => mockUsers)
const service: ITwitterService = { retrieve }

describe('OrganizersResolver', () => {
  let resolver

  beforeEach(() => {
    resolver = new OrganizersResolver(service)
  })

  test('fetches data from ITwitterService', async () => {
    await resolver.resolve()
    expect(retrieve).toHaveBeenCalledTimes(1)
  })

  test('converts data from ITwitterUser to IOrganizer', async () => {
    const organizers = await resolver.resolve()
    const { name, description, screen_name: handle } = mockUsers[0]

    expect(organizers).toEqual([
      {
        name,
        description,
        twitter: {
          name: handle,
          profileImageUrl: expect.any(String),
        },
      },
    ])
  })

  test('uses original size of user profile image', async () => {
    const organizers = await resolver.resolve()

    expect(organizers).toEqual([
      expect.objectContaining({
        twitter: expect.objectContaining({
          profileImageUrl: 'https://example.com/profile.jpg',
        }),
      }),
    ])
  })
})
