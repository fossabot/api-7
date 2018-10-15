/* tslint:disable-next-line:no-var-requires */
require('dotenv').config()

import { ApolloServer, gql } from 'apollo-server-express'
import * as express from 'express'
import { readFileSync } from 'fs'
import { GraphQLDateTime } from 'graphql-iso-date'
import * as helmet from 'helmet'
import { join } from 'path'
import OrganizersResolver from './resolvers/OrganizersResolver'
import UpcomingEventsResolver from './resolvers/UpcomingEventsResolver'
import UpcomingTalksResolver from './resolvers/UpcomingTalksResolver'
import GithubIssueService from './services/GithubIssueService'
import MeetupEventsService from './services/MeetupEventsService'
import TwitterUsersService from './services/TwitterUsersService'
import EnvironmentHelper from './utils/EnvironmentHelper'
import ServiceFetcher from './utils/ServiceFetcher'

const isDevelopment = EnvironmentHelper.get('NODE_ENV') === 'development'

const app = express().use(helmet())

const serviceFetcher = new ServiceFetcher()

const twitterApiKey = EnvironmentHelper.get('TWITTER_API_KEY')
const twitterApiSecret = EnvironmentHelper.get('TWITTER_API_SECRET')
const organizersResolver = new OrganizersResolver(
  new TwitterUsersService(twitterApiKey, twitterApiSecret, serviceFetcher)
)

const upcomingTalksResolver = new UpcomingTalksResolver(
  new GithubIssueService(serviceFetcher)
)
const meetupKey: string = EnvironmentHelper.get('MEETUP_KEY')
const upcomingEventsResolver = new UpcomingEventsResolver(
  new MeetupEventsService(meetupKey, serviceFetcher)
)

const server = new ApolloServer({
  typeDefs: gql`
    ${readFileSync(join(__dirname, 'schema.graphql'))}
  `,
  resolvers: {
    DateTime: GraphQLDateTime,
    Query: {
      organizers: () => organizersResolver.resolve(),
      upcomingEvents: () => upcomingEventsResolver.resolve(),
      upcomingTalks: () => upcomingTalksResolver.resolve(),
    },
  },
  debug: isDevelopment,
  playground: isDevelopment,
})

server.applyMiddleware({
  app,
  path: '/',
  cors: {
    origin: isDevelopment ? '*' : 'https://paderbornjs.org',
  },
})

app.listen({ port: 4000 }, () =>
  console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`)
)
