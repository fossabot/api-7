require('dotenv').config()

import { ApolloServer, gql } from 'apollo-server-express'
import * as express from 'express'
import { readFileSync } from 'fs'
import { GraphQLDateTime } from 'graphql-iso-date'
import * as helmet from 'helmet'
import { join } from 'path'
import OrganizersResolver from './resolvers/OrganizersResolver'
import UpcomingTalksResolver from './resolvers/UpcomingTalksResolver'
import EnvironmentHelper from './utils/EnvironmentHelper'

const isDevelopment = EnvironmentHelper.get('NODE_ENV') === 'development'

const app = express().use(helmet())

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'schema.graphql'))}
`

const organizersResolver = new OrganizersResolver()
const upcomingTalksResolver = new UpcomingTalksResolver()

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    DateTime: GraphQLDateTime,
    Query: {
      organizers: () => organizersResolver.resolve(),
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
