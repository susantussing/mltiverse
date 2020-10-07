import React, { useState, useEffect } from 'react';
import { useAuth } from 'contexts/auth';
import {
  withStyles, Divider, Badge,
  List, Avatar, ListItem, ListItemAvatar, ListItemText, CircularProgress,
  ListItemIcon,
} from '@material-ui/core';
import GameWindow from 'components/game/Game';
import { currentWorld } from 'graphql/cache';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { WORLDS_QUERY, CURRENT_WORLD_QUERY } from 'graphql/queries';
import SidebarLayout from 'layouts/Sidebar';
import LinkIconButton from 'components/LinkIconButton';
import { WORLD_MUTATION } from 'graphql/mutations';

const styles = (theme) => ({
  drawerAvatar: {
    height: 32,
    width: 32,
    fontSize: '0.85rem',
    backgroundColor: theme.palette.primary.main,
  },
});

function Home({ classes }) {
  const [{ userId }] = useAuth();
  const [visible, setVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibility = () => { setVisible(!document.hidden); };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const [getWorlds, { data: worldsData }] = useLazyQuery(
    WORLDS_QUERY,
    { variables: { filter: { user: userId } } },
  );
  const { data: { currentWorld: currentWorldId } } = useQuery(CURRENT_WORLD_QUERY);
  const [updateWorld] = useMutation(WORLD_MUTATION);

  const [worldList, setWorldList] = useState([]);

  const handleChangeWorld = (world) => {
    currentWorld(world);
  };

  useEffect(() => {
    if (userId) {
      getWorlds();
    }
  }, [getWorlds, userId]);

  useEffect(() => {
    if (worldsData && worldsData.worldMany[0]) {
      setWorldList(worldsData.worldMany);
      currentWorld(worldsData.worldMany[0]._id);
    }
  }, [worldsData]);

  useEffect(() => {
    if (visible && currentWorldId) {
      updateWorld({
        variables: {
          record: {
            _id: currentWorldId,
            unread: 0,
          },
        },
      });
    }
  }, [visible, currentWorldId, updateWorld]);

  const Sidebar = () => (
    <>
      <List>
        <ListItem button>
          <ListItemIcon>
            <LinkIconButton icon="PlusCircle" to="/world/new" size={32} edge="start" />
          </ListItemIcon>
          <ListItemText primary="New World" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {worldList.map((world) => (
          <ListItem key={world._id} button onClick={() => handleChangeWorld(world._id)}>
            <ListItemAvatar>
              <Badge color="secondary" badgeContent={world.unread}>
                <Avatar className={classes.drawerAvatar}>{world.name[0]}</Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText>{world.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <SidebarLayout Sidebar={Sidebar} title="M*ltiverse">
      {currentWorldId ? <GameWindow /> : <CircularProgress />}
    </SidebarLayout>
  );
}

export default withStyles(styles)(Home);
