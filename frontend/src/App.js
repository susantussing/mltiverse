import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Home from 'pages/home/Home';
import SignUp from 'pages/home/SignUp';
import Login from 'pages/home/Login';
import { useAuth } from 'contexts/auth';
import Welcome from 'pages/home/Welcome';
import NewWorld from 'pages/world/NewWorld';
import { CircularProgress } from '@material-ui/core';

function App() {
  const [{ token, initialized }] = useAuth();
  return (
    <Router>
      { !initialized ? <CircularProgress /> : (
      token
        ? ( // logged in
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/world/new">
              <NewWorld />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        )
        : ( // not logged in
          <Switch>
            <Route exact path="/">
              <Welcome />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        ))}

    </Router>

  );
}

export default App;
