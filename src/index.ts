import { ApolloServer } from 'apollo-server-express'
import * as express from 'express'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`)
)
