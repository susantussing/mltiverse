import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1),
  },
});

function LinkButton({
  to, children, classes, color = 'default',
}) {
  return (
    <Button variant="contained" fullWidth component={Link} to={to} className={classes.root} color={color}>{children}</Button>
  );
}

export default withStyles(styles)(LinkButton);
