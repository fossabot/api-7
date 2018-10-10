import ServiceFetcher from '../utils/ServiceFetcher'

const BASE_URL = 'https://api.github.com'
const REPOSITORY = 'paderbornjs/talks_test'

class GithubIssueService {
  constructor(private fetcher: ServiceFetcher = new ServiceFetcher()) {}

  public async fetch(requiredLabels: string[]): Promise<any> {
    const labels = requiredLabels.join(',')
    return this.fetcher.fetch(
      `${BASE_URL}/repos/${REPOSITORY}/issues?state=open&labels=${labels}`
    )
  }
}

export default GithubIssueService
