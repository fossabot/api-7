require('dotenv').config()

import { ApolloServer, gql } from 'apollo-server-express'
import * as cors from 'cors'
import * as express from 'express'
import { readFileSync } from 'fs'
import * as helmet from 'helmet'
import { join } from 'path'
import TwitterResolver from './resolvers/TwitterResolver'

const twitterResolver = new TwitterResolver()
const isDevelopment = process.env.NODE_ENV === 'development'

const app = express()
  .use(helmet())
  .use(
    cors({
      origin: isDevelopment ? '*' : 'https://paderbornjs.org',
    })
  )

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'schema.graphql'))}
`

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      organizers: () => twitterResolver.resolve(['code_punkt']),
    },
  },
  debug: isDevelopment,
  playground: isDevelopment,
})

server.applyMiddleware({ app, path: '/' })

app.listen({ port: 4000 }, () =>
  console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`)
)
