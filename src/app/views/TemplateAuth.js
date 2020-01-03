import PropTypes from 'prop-types';
import React from 'react';
import Intercom from 'react-intercom';

const TemplateAuth = ({ children }) => {
  return (
    <>
      <div>{children}</div>
      <Intercom appID="q7dotpic" />
    </>
  );
};

TemplateAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TemplateAuth;
