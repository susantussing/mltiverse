import React, { useState } from 'react';
import {
  withStyles, Container, Typography, AppBar, Toolbar, IconButton, Drawer, Divider,
} from '@material-ui/core';
import * as Icon from 'react-feather';
import clsx from 'clsx';
import { useAuth, logout } from 'contexts/auth';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    padding: '0 8px',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(10),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  drawerAvatar: {
    height: 32,
    width: 32,
    fontSize: '0.85rem',
    backgroundColor: theme.palette.primary.main,
  },
});

function SidebarLayout({
  children, title, Sidebar, classes,
}) {
  const [{ token }, authDispatch] = useAuth();
  function handleLogout() {
    logout(authDispatch, token);
  }
  const [drawerOpen, setDrawerOpen] = useState(false);
  function handleDrawerToggle() {
    setDrawerOpen(!drawerOpen);
  }

  const SidebarComponent = Sidebar || (() => <div />);

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          >
            <Icon.Menu size={32} />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          <IconButton color="inherit">
            <Icon.User />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Icon.LogOut />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerToggle}>
            <Icon.ChevronLeft size={32} />
          </IconButton>
        </div>
        <Divider />
        <SidebarComponent />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>

      </main>
    </div>
  );
}

export default withStyles(styles)(SidebarLayout);
