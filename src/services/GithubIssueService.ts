import IServiceFetcher from '../utils/IServiceFetcher'

export default class GithubIssueService {
  public static BASE_URL = 'https://api.github.com/repos/paderbornjs/talks_test'

  constructor(private fetcher: IServiceFetcher) {}

  public async retrieve(requiredLabels: string[]): Promise<any> {
    const labels = requiredLabels.join(',')
    return this.fetcher.fetch(
      `${GithubIssueService.BASE_URL}/issues?state=open&labels=${labels}`
    )
  }
}
