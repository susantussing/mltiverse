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

function App() {
  const [{ token }] = useAuth();
  return (
    <Router>
      { token
        ? ( // logged in
          <Switch>
            <Route exact path="/">
              <Home />
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
        )}

    </Router>

  );
}

export default App;
