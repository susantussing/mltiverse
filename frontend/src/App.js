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
import EditWorld from 'pages/world/EditWorld';
import { CircularProgress } from '@material-ui/core';

function App() {
  const [{ token, initialized }] = useAuth();
  if (!initialized) {
    return <CircularProgress />;
  }
  return (
    <Router>
      { token ? ( // logged in
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/world/new" component={NewWorld} />
          <Route path="/world/:id" component={EditWorld} />

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      ) : ( // not logged in
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
    </Router>
  );
}

export default App;
