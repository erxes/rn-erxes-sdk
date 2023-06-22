import {
  ApolloClient,
  InMemoryCache,
  split,
  from,
  createHttpLink,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

const baseUrl = 'office.erxes.io/gateway';
// const baseUrl = 'localhost:4000';

export const apiUrl = `https://${baseUrl}`;

// Subscription config
export const wsLink: any = new GraphQLWsLink(
  createClient({
    url: `wss://${baseUrl}/graphql` || 'ws://localhost:4000/graphql',
    retryAttempts: 1000,
    retryWait: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    },
  })
);

const logoutLink = onError(({ networkError, graphQLErrors }) => {
  console.log('--netError', networkError);
  console.log('--gqlError', graphQLErrors);
});

const httpLink = createHttpLink({
  uri: `${apiUrl}/graphql`,
  credentials: 'include',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  from([logoutLink, httpLink])
);

const ClientProvider = () =>
  new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        UserDetailsType: {
          merge: true,
        },
      },
      addTypename: true,
    }),
    defaultOptions: { watchQuery: { fetchPolicy: 'network-only' } },
  });

export default ClientProvider;
