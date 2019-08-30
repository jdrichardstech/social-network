import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { setAlert, login } from '../../actions';

const Login = ({ login, setAlert, isAuthenticated }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = loginData;

  const handleChange = e =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      login(email, password);

      return;
    } catch (err) {
      console.error(err);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into Your Account
      </p>
      <form className="form" onSubmit={e => handleSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => handleChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(
  mapStateToProps,
  { setAlert, login }
)(Login);
