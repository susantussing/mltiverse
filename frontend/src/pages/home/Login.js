import React from 'react';
import { Formik, Field, Form } from 'formik';
import {
  LinearProgress, Button, withStyles,
} from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { login, useAuth } from 'contexts/auth';
import * as Icon from 'react-feather';
import SmallLayout from 'layouts/Small';

const styles = (theme) => ({
  form: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
});

function Login({ classes }) {
  const [, authDispatch] = useAuth();
  const handleSubmit = async (values, actions) => {
    try {
      await login(authDispatch, values.name, values.password);
    } catch (err) {
      actions.setSubmitting(false);
    }
  };
  return (
    (
      <SmallLayout
        title="Sign In"
        icon={<Icon.UserCheck />}
      >
        <Formik initialValues={{ name: '', password: '' }} onSubmit={handleSubmit}>
          {({ submitForm, isSubmitting }) => (
            <Form className={classes.form}>
              <Field component={TextField} name="name" type="text" label="Name" fullWidth />
              <Field component={TextField} name="password" type="password" label="Password" fullWidth />
              {isSubmitting && <LinearProgress />}
              <Button disabled={isSubmitting} onClick={submitForm} fullWidth variant="contained" color="primary">Submit</Button>
            </Form>
          )}
        </Formik>
      </SmallLayout>
    )
  );
}

export default withStyles(styles)(Login);
