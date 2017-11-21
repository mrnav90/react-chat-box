import React from 'react';
import PropTypes from 'prop-types';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {SwitchRouter} from 'routes';

const AppRoutes = ({routes}) => {
  if (!routes) {
    return null;
  }

  return (
    <SwitchRouter>
      {routes.map((route, idx) => (
        <Route key={idx} path={route.path} exact={route.exact} render={(props) => (
          <route.component {...props} route={route} routes={route.routes}/>
        )}/>
      ))}
    </SwitchRouter>
  );
};

AppRoutes.propTypes = {
  routes: PropTypes.array.isRequired,
  parent: PropTypes.array
};

export default withRouter(connect()(AppRoutes));
