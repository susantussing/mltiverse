import React, { useEffect, useRef } from 'react';
import {
  useQuery, useMutation,
} from '@apollo/client';
import * as Icon from 'react-feather';
import {
  IconButton, Container, Paper, Divider, withStyles, Typography, Grid,
} from '@material-ui/core';
import { CURRENT_WORLD_QUERY, WORLD_QUERY } from 'graphql/queries';
import { WORLD_MUTATION } from 'graphql/mutations';
import { WORLD_UPDATE_SUBSCRIPTION } from 'graphql/subscriptions';
import OutputContainer from './output/OutputContainer';
import InputContainer from './input/InputContainer';

const styles = (theme) => ({
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  outputWindow: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: 'black',
    color: 'white',
    fontFamily: 'Fira Code',
    overflowY: 'scroll',
    height: '320px',
    whiteSpace: 'pre',
    fontSize: '0.75rem',
  },
  toolbar: {
    justifyContent: 'space-between',
    padding: theme.spacing(1),
  },

  title: {
    flexBasis: '500px',
    padding: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'left',
    },
  },
  toolbarButtons: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
    },
  },
  system: {
    color: theme.palette.info.main,
    borderWidth: '1px 0',
    borderStyle: 'solid',
    borderColor: theme.palette.info.main,
  },

});

const GameWindow = ({ classes }) => {
  const { data: { currentWorld: worldId } } = useQuery(CURRENT_WORLD_QUERY);

  const [worldMutation] = useMutation(WORLD_MUTATION, { refetchQueries: ['GetWorld'] });

  const { data: worldData, called, subscribeToMore } = useQuery(WORLD_QUERY,
    { variables: { filter: { _id: worldId } } });

  const unsubscribe = useRef();
  useEffect(() => {
    if (worldId && called) {
      unsubscribe.current = subscribeToMore({
        document: WORLD_UPDATE_SUBSCRIPTION,
        variables: { worldId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          return { worldOne: subscriptionData.data.worldUpdate };
        },
      });
    }
    return () => {
      unsubscribe.current();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [called, worldId]);

  return (
    <Container>
      <Paper className={classes.paper}>
        <Grid className={classes.toolbar} container>
          <Grid item xs={12} sm={9}>
            <Typography className={classes.title}>
              {worldData && worldData.worldOne.name}
            </Typography>
          </Grid>
          <Grid item className={classes.toolbarButtons} xs>
            <IconButton><Icon.Sliders /></IconButton>

            <IconButton
              title={worldData && worldData.worldOne.isConnected ? 'Disconnect' : 'Connect'}
              onClick={() => {
                // Trigger connection/disconnection.
                // Don't cache this because subscription will tell us when it's done.
                worldMutation({
                  variables: {
                    record: {
                      _id: worldId,
                      status:
                      worldData && worldData.worldOne.isConnected
                        ? 'disconnecting'
                        : 'connecting',
                    },
                  },
                  fetchPolicy: 'no-cache',
                });
              }}
            >
              {worldData && worldData.worldOne.isConnected ? <Icon.Zap /> : <Icon.ZapOff />}
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <OutputContainer />
        <InputContainer />
      </Paper>

    </Container>
  );
};
export default withStyles(styles)(GameWindow);
