import { ITalk } from '../schema'
import IGithubIssueService from '../services/IGithubIssueService'

const talkRegExp = /^#{5} (.+)(?:\s+#{6} (.+))?(?:\s+#{6} \[(.+)]\((.+)\))?\s+([\s\S]+)\s*$/

export interface IGithubIssue {
  body: string
  labels: Array<{ name: string }>
  milestone?: {
    due_on: string
  }
  title: string
  user: {
    avatar_url: string
  }
}

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
export default class UpcomingTalksResolver {
  public static LIGHTNING_TALK_LABEL = 'Lightning Talk'
  public static UPCOMING_TALK_LABEL = 'Upcoming Talk'

  constructor(private githubIssueService: IGithubIssueService) {}

  public resolve(): Promise<ITalk[]> {
    return this.githubIssueService
      .retrieve([UpcomingTalksResolver.UPCOMING_TALK_LABEL])
      .then(issues =>
        issues
          .filter(
            ({ milestone }: IGithubIssue) =>
              Boolean(milestone) &&
              new Date(milestone.due_on).valueOf() > new Date().valueOf()
          )
          .map(
            (issue: IGithubIssue): ITalk => {
              const talkInfo = this.parseTalkInformation(issue.body)

              return talkInfo
                ? {
                    date: this.convertMilestoneToMeetupDate(
                      issue.milestone.due_on
                    ),
                    description: talkInfo.description,
                    isLightningTalk: issue.labels.some(
                      label =>
                        label.name ===
                        UpcomingTalksResolver.LIGHTNING_TALK_LABEL
                    ),
                    labels: issue.labels
                      .filter(
                        label =>
                          ![
                            UpcomingTalksResolver.UPCOMING_TALK_LABEL,
                            UpcomingTalksResolver.LIGHTNING_TALK_LABEL,
                          ].includes(label.name)
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
                : null
            }
          )
          .filter((talk: ITalk) => talk !== null)
      )
  }

  private convertMilestoneToMeetupDate(milestoneDate: string): Date {
    const date = new Date(milestoneDate)
    date.setDate(date.getDate() - 1)
    date.setHours(19)
    return date
  }

  private parseTalkInformation(issueBody: string): any {
    const matches = issueBody.match(talkRegExp)

    if (!matches) {
      return null
    }

    const [
      name,
      occupation,
      socialName,
      socialUrl,
      description,
    ] = matches.slice(1, 6)

    return {
      name,
      occupation,
      socialName,
      socialUrl,
      description,
    }
  }
}
