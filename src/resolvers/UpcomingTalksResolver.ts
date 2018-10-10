import GithubIssueService from '../services/GithubIssueService'

const lightningTalkLabel: string = 'Lightning Talk'
const upcomingTalkLabel: string = 'Upcoming Talk'

const talkRegExp = /^#{5} (.+)(?:\s+#{6} (.+))?(?:\s+#{6} \[(.+)]\((.+)\))?\s+([\s\S]+)\s*$/

/**
 * Upcoming talks are fetched from Github issues - each issue is either a talk
 * idea or an upcoming talk. When an issue has a milestone (which matches a
 * meetup event), the talk is planned to be held at that date.
 *
 * To show the talks that are planned for the next meetups, we fetch the open
 * issues with the label "Upcoming Talks" from the Github API and filter them
 * to remove issues that are in the past (and might not have been set to
 * closed yet).
 */
class UpcomingTalksResolver {
  constructor(
    private githubIssueService: GithubIssueService = new GithubIssueService()
  ) {}

  public resolve(): Promise<any> {
    return this.githubIssueService.fetch([upcomingTalkLabel]).then(issues =>
      issues
        .filter(
          ({ milestone }) =>
            Boolean(milestone) &&
            new Date(milestone.due_on).valueOf() > new Date().valueOf()
        )
        .map(issue => {
          const talkInfo = this.parseTalkInformation(issue.body)

          return {
            date: this.convertMilestoneToMeetupDate(issue.milestone.due_on),
            description: talkInfo.description,
            isLightningTalk: issue.labels.some(
              label => label.name === lightningTalkLabel
            ),
            labels: issue.labels
              .filter(
                label =>
                  ![upcomingTalkLabel, lightningTalkLabel].includes(label.name)
              )
              .map(label => label.name),
            speaker: {
              avatarUrl: issue.user.avatar_url,
              name: talkInfo.name,
              occupation: talkInfo.occupation,
              socialName: talkInfo.socialName,
              socialUrl: talkInfo.socialUrl,
            },
            title: issue.title,
          }
        })
    )
  }

  private convertMilestoneToMeetupDate(milestoneDate: string): Date {
    const date = new Date(milestoneDate)
    date.setDate(date.getDate() - 1)
    date.setHours(19)
    return date
  }

  private parseTalkInformation(issueBody: string): any {
    console.log(issueBody)
    const [
      name,
      occupation,
      socialName,
      socialUrl,
      description,
    ] = issueBody.match(talkRegExp).slice(1, 6)

    return {
      name,
      occupation,
      socialName,
      socialUrl,
      description,
    }
  }
}

export default UpcomingTalksResolver
