import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Dashboard } from './components/dashboard';
import { Navbar, Landing, Alert } from './components/layout';
import { Register, Login } from './components/auth';
import { loadUser } from './actions';
import setAuthToken from './utils/setAuthToken';
import './App.css';

if (localStorage.token) {
  setAuthToken(window.localStorage.token);
}

const App = () => {
  useEffect(() => {
    if (window.localStorage.token) {
      store.dispatch(loadUser());
    }
    console.log('Mounted');
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />

          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
            </Switch>
          </section>
        </>
      </Router>
    </Provider>
  );
};

export default App;
