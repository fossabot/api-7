import UpcomingTalksResolver from '../resolvers/UpcomingTalksResolver'
import GithubIssueService from './GithubIssueService'

const mockIssues = [{ title: 'talk1' }]

describe('GithubIssueService', () => {
  test('fetches talk information from Github API', async () => {
    const fetch = jest.fn().mockImplementation(async () => mockIssues)
    const service = new GithubIssueService({ fetch })
    const result = await service.retrieve([
      UpcomingTalksResolver.UPCOMING_TALK_LABEL,
    ])

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      `${GithubIssueService.BASE_URL}/issues?state=open&labels=${
        UpcomingTalksResolver.UPCOMING_TALK_LABEL
      }`
    )
    expect(result).toEqual(mockIssues)
  })
})
