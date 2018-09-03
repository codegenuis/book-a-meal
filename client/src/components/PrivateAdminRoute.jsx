import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ConnectedSignOut from './SignOut';

export const PrivateAdminRoute = ({
  loggedIn, userRole, component: Component, ...rest
}) => (
  <Route
    {...rest}
    render={props => (
    loggedIn && (userRole === 'caterer' || userRole === 'superAdmin') ?
      <Component {...props} />
      :
      <ConnectedSignOut><Redirect to="/signin" /></ConnectedSignOut>)}
  />
);

PrivateAdminRoute.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
  userRole: state.user.data.role,
});

export default connect(mapStateToProps)(PrivateAdminRoute);
