export default interface IMeetupEventsService {
  retrieve(eventStatus: string): Promise<any>
}
