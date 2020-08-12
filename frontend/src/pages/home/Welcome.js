import React from 'react';
import * as Icon from 'react-feather';
import SmallLayout from 'layouts/Small';
import LinkButton from 'components/LinkButton';
import { withStyles } from '@material-ui/core';

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing(2),
  },
});

function Welcome({ classes }) {
  return (
    <SmallLayout icon={<Icon.UserPlus />} title="Welcome">
      <LinkButton to="/login" variant="contained" fullWidth color="primary" className={classes.button}>Login</LinkButton>
      <LinkButton to="/signup" variant="contained" fullWidth color="primary" className={classes.button}>Sign Up</LinkButton>
    </SmallLayout>
  );
}

export default withStyles(styles)(Welcome);
