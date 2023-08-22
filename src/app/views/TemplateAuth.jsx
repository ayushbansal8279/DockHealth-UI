import PropTypes from 'prop-types';
import React from 'react';

const TemplateAuth = ({ children }) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};

TemplateAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TemplateAuth;
