import React from "react";

import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../../utlis/cookies'


//https://reactrouter.com/web/api/Route

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => (
        getToken() ? <Component {...routeProps} /> : <Redirect to='/login' />
      )}
    />
  );
}
export default PrivateRoute;