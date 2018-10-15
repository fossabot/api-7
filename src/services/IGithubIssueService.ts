export default interface IGithubIssueService {
  retrieve(requiredLabels: string[]): Promise<any>
}
