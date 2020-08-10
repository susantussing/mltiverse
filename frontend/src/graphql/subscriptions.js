import { gql } from '@apollo/client';

export const HISTORY_SUBSCRIPTION = gql`
  subscription SubscribeToHistory ($worldId: MongoID!) {
    lineCreated(worldId: $worldId) {
      _id
      line
      type
      createdAt
    }
  }
`;

export const WORLD_UPDATE_SUBSCRIPTION = gql`
  subscription SubscribeToWorld ($worldId: MongoID!) {
    worldUpdate(worldId: $worldId) {
      _id
      name
      isConnected
    }
  }
`;
