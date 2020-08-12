import React from 'react';
import SidebarLayout from 'layouts/Sidebar';
import WorldForm from 'components/WorldForm';
import { useAuth } from 'contexts/auth';
import { WORLD_QUERY } from 'graphql/queries';
import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import WorldSidebar from './WorldSidebar';

function EditWorld({ match }) {
  const worldId = match.params.id;
  const [{ userId }] = useAuth();

  const { data, loading } = useQuery(WORLD_QUERY, { variables: { filter: { _id: worldId } }, fetchPolicy: 'network-only' });

  return (
    <SidebarLayout title="Edit World" Sidebar={WorldSidebar}>
      {loading ? <CircularProgress /> : (
        <WorldForm initialValues={{
          user: userId,
          ...data.worldOne,
        }}
        />
      )}
    </SidebarLayout>
  );
}

export default EditWorld;
