import React from 'react';
import PropTypes from 'prop-types';

class ShowIf extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    if (this.props.condition) {
      return this.props.children;
    }
    return null;
  }
}

ShowIf.proptTypes = {
  condition: PropTypes.bool.isRequired,
  children: PropTypes.node
};

export default ShowIf;
