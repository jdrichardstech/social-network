import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = loginData;

  const handleChange = e =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    const newLoginData = {
      email,
      password
    };

    try {
      const config = {
        header: {
          "Content-Type": "application/json"
        }
      };
      // const body = JSON.stringify(newFormData);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        newLoginData,
        config
      );
      console.log(res.data);
      return;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="container">
      <div className="alert alert-danger">Invalid credentials</div>
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
            required
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
export default Login;
