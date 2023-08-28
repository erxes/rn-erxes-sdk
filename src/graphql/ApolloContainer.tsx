import React from 'react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  from,
  createHttpLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const ApolloContainer = ({ children, subDomain }: any) => {
  const socketUrl = `wss://${subDomain}/gateway/graphql`;
  const apiUrl = `https://${subDomain}/gateway`;

  // Subscription config
  const wsLink: any = new GraphQLWsLink(
    createClient({
      url: socketUrl || 'ws://localhost:4000/graphql',
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

  return <ApolloProvider client={ClientProvider()}>{children}</ApolloProvider>;
};

export default ApolloContainer;
