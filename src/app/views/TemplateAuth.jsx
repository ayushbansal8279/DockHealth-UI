import PropTypes from 'prop-types';
import React from 'react';
import Intercom from 'react-intercom';

const { VITE_INTERCOM_APP_CODE } = import.meta.env;

const TemplateAuth = ({ children }) => {
  return (
    <>
      <div>{children}</div>
      <Intercom appID={VITE_INTERCOM_APP_CODE} />
    </>
  );
};

TemplateAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TemplateAuth;
