import React, { PureComponent } from 'react';
import ChangePhoneNumberForm from '../../components/auth/ChangePhoneNumberForm';

export default class ChangePhoneNumber extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <ChangePhoneNumberForm type="Confirm" />;
  }
}
