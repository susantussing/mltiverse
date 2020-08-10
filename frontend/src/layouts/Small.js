import React from 'react';
import {
  withStyles, Container, Paper, Avatar, Typography,
} from '@material-ui/core';
import * as Icon from 'react-feather';

const styles = (theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    marginTop: theme.spacing(2),
  },
});

function SmallLayout({
  children, title, icon = <Icon.HelpCircle />, classes,
}) {
  return (
    <Container maxWidth="xs">
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          {icon}
        </Avatar>
        <Typography component="h1" variant="h5">{title}</Typography>
        {children}
      </Paper>
    </Container>
  );
}

export default withStyles(styles)(SmallLayout);
