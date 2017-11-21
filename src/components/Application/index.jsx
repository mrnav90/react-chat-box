import React from 'react';
import PropTypes from 'prop-types';
import {AppRoutes} from 'routes';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';

class Application extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <AppRoutes routes={this.props.route.routes}/>
    );
  }
}

Application.contextTypes = {
  router: PropTypes.object
};

Application.propTypes = {
  route: PropTypes.object
};

export default connect()(withRouter(Application));
