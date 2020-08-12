/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, withStyles } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { useMutation } from '@apollo/client';
import { WORLD_CREATE_MUTATION, WORLD_MUTATION } from 'graphql/mutations';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import LinkButton from './LinkButton';

const WorldValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  host: Yup.string().required('Required'),
  port: Yup.number().integer('Port must be an integer')
    .min(1000, 'Must be from 1000-9999')
    .max(9999, 'Must be from 1000-9999')
    .required('Required'),
});

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing(1),
  },
});

function WorldForm({ initialValues, classes }) {
  const history = useHistory();
  const [saveWorld] = useMutation(initialValues._id ? WORLD_MUTATION : WORLD_CREATE_MUTATION, {
    onCompleted: (data) => {
      const response = data.worldCreateOne || data.worldUpdateById;
      history.push(`/world/${response.record._id}`);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values) => {
        // Send world create/update mutation
        const record = { ...values };
        delete record.isConnected;
        delete record.__typename;
        await saveWorld({
          variables: {
            record,
          },
        });
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={submitForm}
            disabled={isSubmitting}
            className={classes.button}
          >
            Submit
          </Button>
          <LinkButton to="/" color="secondary" className={classes.button}>Cancel</LinkButton>
        </Form>
      )}
    </Formik>

  );
}

export default withStyles(styles)(WorldForm);
