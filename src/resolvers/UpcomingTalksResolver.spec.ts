import IGithubIssueService from '../services/IGithubIssueService'
import UpcomingTalksResolver, { IGithubIssue } from './UpcomingTalksResolver'

const now = new Date()
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const mockUser = { avatar_url: 'https://example.com/avatar_url.jpg' }
const mockIssues: IGithubIssue[] = [
  {
    body: 'filtered out because of milestone due date',
    labels: [],
    milestone: { due_on: now.toISOString() },
    title: 'Issue 1',
    user: mockUser,
  },
  {
    body: 'filtered out because of missing milestone',
    labels: [],
    title: 'Issue 2',
    user: mockUser,
  },
  {
    body: `##### John Doe
###### Research Engineer at Spacebook
###### [@johndoe](https://example.com/johndoe)

Issue 3`,
    labels: [{ name: 'Upcoming Talk' }, { name: 'Architecture' }],
    milestone: { due_on: tomorrow.toISOString() },
    title: 'Issue 3',
    user: mockUser,
  },
  {
    body: 'cannot be parsed because of wrong format',
    labels: [],
    milestone: { due_on: tomorrow.toISOString() },
    title: 'Issue 4',
    user: mockUser,
  },
  {
    body: `##### John Doe
###### Research Engineer at Spacebook
###### [@johndoe](https://example.com/johndoe)

Issue 5`,
    labels: [
      { name: 'Upcoming Talk' },
      { name: 'Lightning Talk' },
      { name: 'OSS Licensing' },
    ],
    milestone: { due_on: tomorrow.toISOString() },
    title: 'Issue 5',
    user: mockUser,
  },
]

const retrieve = jest.fn().mockImplementation(async () => mockIssues)
const service: IGithubIssueService = { retrieve }

describe('UpcomingTalksResolver', () => {
  let resolver

  beforeEach(() => {
    resolver = new UpcomingTalksResolver(service)
  })

  test('fetches data from IGithubIssueService', async () => {
    await resolver.resolve()
    expect(retrieve).toHaveBeenCalledTimes(1)
  })

  test(`removes every issue that is not parseable or doesn't have a future milestone`, async () => {
    const issues = await resolver.resolve()
    expect(issues.length).toBe(2)
  })

  test('converts data from IGithubIssue to ITalk', async () => {
    const issues = await resolver.resolve()

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(Date),
          description: expect.any(String),
          isLightningTalk: expect.any(Boolean),
          labels: expect.arrayContaining([expect.any(String)]),
          speaker: expect.objectContaining({
            avatarUrl: expect.any(String),
            name: expect.any(String),
            occupation: expect.any(String),
            socialName: expect.any(String),
            socialUrl: expect.any(String),
          }),
          title: expect.any(String),
        }),
      ])
    )
  })

  test('sets meetup date of ITalk to 7pm', async () => {
    const issues = await resolver.resolve()

    expect(issues[0].date.getHours()).toEqual(19)
    expect(issues[1].date.getHours()).toEqual(19)
  })

  test('correctly identifies the lightning talk label', async () => {
    const issues = await resolver.resolve()

    expect(issues[0].isLightningTalk).toBe(false)
    expect(issues[1].isLightningTalk).toBe(true)
  })

  test('filters out upcoming and lightning talk labels', async () => {
    const issues = await resolver.resolve()

    expect(issues[0].labels).toEqual(['Architecture'])
    expect(issues[1].labels).toEqual(['OSS Licensing'])
  })

  test('correctly parses information from issue body', async () => {
    const issues = await resolver.resolve()

    const speakerObject = expect.objectContaining({
      name: 'John Doe',
      occupation: 'Research Engineer at Spacebook',
      socialName: '@johndoe',
      socialUrl: 'https://example.com/johndoe',
    })

    expect(issues[0].description).toEqual('Issue 3')
    expect(issues[0].speaker).toEqual(speakerObject)
    expect(issues[1].description).toEqual('Issue 5')
    expect(issues[1].speaker).toEqual(speakerObject)
  })
})
