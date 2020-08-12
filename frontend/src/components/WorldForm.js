/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { useMutation } from '@apollo/client';
import { WORLD_CREATE_MUTATION } from 'graphql/mutations';
import * as Yup from 'yup';
import { useAuth } from 'contexts/auth';
import LinkButton from './LinkButton';

const WorldValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  host: Yup.string().required('Required'),
  port: Yup.number().integer('Port must be an integer').required('Required'),
});

export default function WorldForm() {
  const [createWorld] = useMutation(WORLD_CREATE_MUTATION);
  const [{ userId }] = useAuth();
  return (
    <Formik
      initialValues={{ user: userId }}
      onSubmit={(values, { resetForm }) => {
        // Send world create/update mutation
        createWorld({
          variables: {
            record: { ...values },
          },
        });
        resetForm();
      }}
      validationSchema={WorldValidationSchema}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Field
            component={TextField}
            name="name"
            type="text"
            label="Name"
            fullWidth
          />
          <Field
            component={TextField}
            name="host"
            type="text"
            label="Host"
            fullWidth
          />
          <Field
            component={TextField}
            name="port"
            type="number"
            label="Port"
            fullWidth
          />
          <Button variant="contained" color="primary" fullWidth onClick={submitForm} disabled={isSubmitting}>Submit</Button>
          <LinkButton to="/" color="secondary">Cancel</LinkButton>
        </Form>
      )}
    </Formik>

  );
}
