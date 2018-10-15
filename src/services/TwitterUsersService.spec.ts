import TwitterUsersService from './TwitterUsersService'

const mockUsers = [{ name: 'John Doe' }]
const mockToken = 'mockToken'

describe('TwitterUsersService', () => {
  let service
  let fetch

  beforeEach(() => {
    fetch = jest
      .fn()
      .mockImplementation(
        async (url, options) =>
          options.method === 'POST'
            ? `{"access_token":"${mockToken}"}`
            : mockUsers
      )
    service = new TwitterUsersService('key', 'secret', { fetch })
  })

  test('fetches accessToken on first retrieve', async () => {
    await service.retrieve(['code_punkt'])

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      TwitterUsersService.TOKEN_URL,
      expect.objectContaining({
        method: 'POST',
        json: false,
        body: 'grant_type=client_credentials',
        headers: expect.objectContaining({
          Authorization: expect.any(String),
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }),
      })
    )
  })

  test('fetches user information on subsequent retrieves', async () => {
    const result = await service.retrieve(['code_punkt'])

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      `${TwitterUsersService.BASE_URL}/lookup.json?screen_name=code_punkt`,
      { headers: { Authorization: `Bearer ${mockToken}` } }
    )
    expect(result).toEqual(mockUsers)
  })
})
