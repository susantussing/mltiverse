import { gql } from '@apollo/client';

export const CURRENT_WORLD_QUERY = gql`
  query GetCurrentWorld {
    currentWorld @client
  }
`;

export const WORLD_QUERY = gql`
  query GetWorld ($filter: FilterFindOneWorldInput) {
    worldOne(filter: $filter) {
      _id
      name
      isConnected
      status
      host
      port
    }
  }
`;

export const WORLDS_QUERY = gql`
  query GetWorlds ($filter: FilterFindManyWorldInput) {
    worldMany(filter: $filter) {
      _id
      name
      unread
    }
  }
`;

export const HISTORY_QUERY = gql`
query GetHistory ($filter: FilterFindManyHistoryLineInput!)
  {
    historyLineMany(
      filter: $filter
      limit: 50000
    ) {
      _id
      type
      line
      createdAt
      world
    }
  }
`;
