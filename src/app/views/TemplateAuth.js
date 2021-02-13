import PropTypes from 'prop-types';
import React from 'react';
import Intercom from 'react-intercom';

const { INTERCOM_APP_CODE } = process.env;

const TemplateAuth = ({ children }) => {
  return (
    <>
      <div>{children}</div>
      <Intercom appID={INTERCOM_APP_CODE} />
    </>
  );
};

TemplateAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TemplateAuth;
