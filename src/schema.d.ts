interface ITwitterAccount {
  name: string
  profileImageUrl: string
}

interface IEventVenue {
  city: string
  country: string
  lat: number
  lon: number
  name: string
  street: string
}

interface ISpeaker {
  avatarUrl: string
  name: string
  occupation: string
  socialName: string
  socialUrl: string
}

export interface IOrganizer {
  description: string
  name: string
  twitter: ITwitterAccount
}

export interface IEvent {
  date: Date
  goingCount: number
  url: string
  venue: IEventVenue
}

export interface ITalk {
  date: Date
  description: string
  isLightningTalk: boolean
  labels: string[]
  speaker: ISpeaker
  title: string
}
