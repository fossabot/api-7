export default interface ITwitterUsersService {
  retrieve(twitterHandles: string[]): Promise<any>
}
