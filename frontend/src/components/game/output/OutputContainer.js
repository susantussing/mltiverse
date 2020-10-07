/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { CURRENT_WORLD_QUERY, HISTORY_QUERY } from 'graphql/queries';
import { HISTORY_SUBSCRIPTION } from 'graphql/subscriptions';
import Output from './Output';

export default function OutputContainer() {
  const { data: { currentWorld: worldId } } = useQuery(CURRENT_WORLD_QUERY);
  const {
    data, loading, error, subscribeToMore, called,
  } = useQuery(HISTORY_QUERY, { variables: { filter: { world: worldId } } });
  const unsubscribe = useRef();

  useEffect(() => {
    if (worldId && called) {
      unsubscribe.current = subscribeToMore({
        document: HISTORY_SUBSCRIPTION,
        variables: { worldId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data || !(prev.historyLineMany instanceof Array)) return prev;
          const lines = prev.historyLineMany.slice();
          return { historyLineMany: lines.push(subscriptionData.data.lineCreated) };
        },
      });
    }
    return () => {
      unsubscribe.current();
    };
  }, [worldId, called, subscribeToMore]);

  return (
    <Output
      data={data}
      loading={loading}
      error={error}
    />
  );
}
