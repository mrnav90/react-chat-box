import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Loader extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className={classNames('loader', {'show-loading': this.props.isShow})}>
        <div className="inner"></div>
        <div className="inner"></div>
        <div className="inner"></div>
      </div>
    );
  }
}

Loader.propTypes = {
  isShow: PropTypes.bool.isRequired
};

export default Loader;
