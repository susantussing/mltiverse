/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CURRENT_WORLD_QUERY, WORLD_QUERY } from 'graphql/queries';
import { INPUT_MUTATION } from 'graphql/mutations';
import { Formik, Form } from 'formik';
import Input from './Input';

export default function InputContainer() {
  const { data: { currentWorld: worldId } } = useQuery(CURRENT_WORLD_QUERY);
  const [sendCommand, { loading }] = useMutation(INPUT_MUTATION);
  const { data: worldData } = useQuery(WORLD_QUERY, { variables: { filter: { _id: worldId } } });
  const isConnected = worldData && worldData.worldOne.isConnected;
  return (
    <Formik
      initialValues={{ command: '' }}
      onSubmit={(values, { resetForm }) => {
        sendCommand({
          variables: {
            record: {
              line: values.command,
              type: 'input',
              world: worldId,
            },
          },
        });
        resetForm();
      }}
    >
      {({ handleSubmit }) => (
        <Form>
          <Input handleSubmit={handleSubmit} loading={loading} isConnected={isConnected} />
        </Form>
      )}
    </Formik>
  );
}
