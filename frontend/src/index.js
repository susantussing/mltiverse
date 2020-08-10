import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './ansiColors.css';
import { AuthProvider } from 'contexts/auth';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  ApolloProvider, ApolloClient, split, HttpLink,
} from '@apollo/client';
import theme from 'theme';
import { CssBaseline } from '@material-ui/core';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { cache } from 'graphql/cache';
import * as serviceWorker from './serviceWorker';
import App from './App';

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql',
  options: {
    reconnect: true,
  },
});

const link = split(({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
  );
},
wsLink,
httpLink);

const client = new ApolloClient({
  cache,
  link,
});

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <CssBaseline />
          <App />
        </ApolloProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
