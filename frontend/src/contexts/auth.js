import React, { useEffect } from 'react';

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

function authReducer(state, action) {
  switch (action.type) {
    case 'initializeAuth': {
      return { ...state, initialized: true };
    }
    case 'setToken': {
      return { ...state, token: action.token };
    }
    case 'setUserId': {
      return { ...state, userId: action.userId };
    }
    case 'startLogin': {
      return { ...state, loggingIn: true };
    }
    case 'finishLogin': {
      return { ...state, loggingIn: false, userId: action.user._id };
    }
    case 'failLogin': {
      console.error(action.err);
      return { ...state, loggingOut: false };
    }
    case 'startLogout': {
      return { ...state, loggingOut: true };
    }
    case 'finishLogout': {
      return {
        ...state, loggingOut: false, userId: null, token: null,
      };
    }
    case 'failLogout': {
      console.error(action.err);
      return { ...state, loggingOut: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

async function login(dispatch, name, password) {
  dispatch({ type: 'startLogin' });
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const responseJson = await response.json();

    if (response.ok) {
      dispatch({ type: 'setToken', token: responseJson.token });
      dispatch({ type: 'finishLogin', user: responseJson.user });
      dispatch({ type: 'initializeAuth' });
    } else {
      dispatch({ type: 'failLogin', err: responseJson.message });
    }
  } catch (err) {
    dispatch({ type: 'failLogin', err });
    throw new Error('Login failed');
  }
}

async function refresh(dispatch) {
  try {
    const response = await fetch('http://localhost:5000/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    const { token, user } = await response.json();
    if (response.ok && token) {
      dispatch({ type: 'setToken', token });
      dispatch({ type: 'setUserId', userId: user._id });
    }
    dispatch({ type: 'initializeAuth' });
  } catch (err) {
    console.error(err);
  }
}

async function logout(dispatch, { token, apolloClient }) {
  dispatch({ type: 'startLogout' });
  try {
    const response = await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    const responseJson = await response.json();
    if (response.ok) {
      apolloClient.clearStore();
      dispatch({ type: 'finishLogout' });
    } else {
      dispatch({ type: 'failLogout', err: responseJson.message });
    }
  } catch (err) {
    dispatch({ type: 'failLogout', err });
  }
}

function AuthProvider({ children }) {
  const initialState = {
    token: null,
    userId: null,
    initialized: false,
  };
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  useEffect(() => {
    // On initial load, go attempt to refresh the token.
    async function doRefresh() {
      await refresh(dispatch);
    }
    if (!state.token) {
      doRefresh();
    } else {
      setTimeout(() => {
        // Attempt to refresh token just slightly before it really expires
        dispatch({ type: 'setToken', token: null });
      }, 15 * 60000 - 15000);
    }
  }, [state.token]);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}

function useAuth() {
  return [useAuthState(), useAuthDispatch()];
}

export {
  AuthProvider, useAuth, login, refresh, logout,
};
