import React from 'react';
import LinkIconButton from 'components/LinkIconButton';
import {
  List, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';

export default function WorldSidebar() {
  return (
    <>
      <List>
        <ListItem button>
          <ListItemIcon>
            <LinkIconButton size={32} to="/" icon="ArrowLeftCircle" edge="start" />
          </ListItemIcon>
          <ListItemText primary="Go Back" />
        </ListItem>
      </List>

    </>
  );
}
