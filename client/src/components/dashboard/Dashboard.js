import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Dashboard = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>Main DashBoard</h1>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps)(Dashboard);
