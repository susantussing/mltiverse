import React from 'react';
import { Formik, Field, Form } from 'formik';
import { LinearProgress, Button, withStyles } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

const styles = (theme) => ({
  form: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
});

function UserForm({ initialValues = { name: '', password: '' }, handleSubmit = () => {}, classes }) {
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ submitForm, isSubmitting }) => (
        <Form className={classes.form}>
          <Field component={TextField} name="name" type="text" label="User name" fullWidth />
          <Field component={TextField} name="password" type="password" label="Password" fullWidth />
          {isSubmitting && <LinearProgress />}
          <Button disabled={isSubmitting} onClick={submitForm} fullWidth variant="contained" color="primary">Submit</Button>
        </Form>
      )}

    </Formik>
  );
}

export default withStyles(styles)(UserForm);
