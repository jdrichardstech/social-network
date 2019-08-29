import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Navbar, Landing } from './components/layout';
import { Register, Login } from './components/auth';
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />

          <Route exact path="/" component={Landing} />
          <section className="container">
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </>
      </Router>
    </Provider>
  );
};

export default App;
