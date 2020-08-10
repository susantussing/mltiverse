import { gql } from '@apollo/client';

export const INPUT_MUTATION = gql`
  mutation SendCommand ($record: CreateOneHistoryLineInput!) {
    historyLineCreateOne(record: $record) {
      record {
        world
        line
      }
    }
  }
`;

export const WORLD_MUTATION = gql`
  mutation SendWorldUpdate ($record: UpdateByIdWorldInput!) {
    worldUpdateById(record: $record) {
      record {
        _id
        status
        isConnected
      }
    }
  }
`;
