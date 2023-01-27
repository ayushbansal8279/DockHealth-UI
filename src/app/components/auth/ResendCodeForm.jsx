import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthField from 'components/auth/AuthField/AuthField';

const ResendCodeForm = (props) => {
  const { handleSubmit, invalid, pristine, submitting } = props;

  const [username, setUsername] = useState('');

  const errors = {};
  if (!username) {
    errors.username = 'Required';
  } else if (!/^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i.test(username)) {
    errors.username = 'Please enter a valid email address';
  }

  return (
    <form className="inline-label top-buffer" onSubmit={handleSubmit}>
      <div className="row expanded">
        <AuthField
          input={{
            value: username,
            onChange: (event) => {
              setUsername(event.target.value);
            },
          }}
          name="username"
          type="text"
          label="Email"
          meta={{ error: errors.username }}
        />
        <div className="columns small-12 text-center top-buffer">
          <button
            className={`button secondary expand${
              submitting ? ' is-loading' : ''
            }`}
            type="submit"
            disabled={invalid || pristine || submitting}
          >
            Resend code
          </button>
        </div>
        <div className="columns small-12 top-buffer text-right details">
          <Link to="/auth/confirmRegistration">Confirm registration</Link>
        </div>
      </div>
    </form>
  );
};

export default ResendCodeForm;
