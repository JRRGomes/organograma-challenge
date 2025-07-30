import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../../../lib/graphql/schema';
import { resolvers } from '../../../lib/graphql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code,
      path: error.path,
    };
  },
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
