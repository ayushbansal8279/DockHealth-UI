import React from 'react';
import styled from 'styled-components';
import EnvelopeIcon from '../../img/envelope.svg';

const EmailBodyContainer = styled.div`
  background-color: #f3f5f6;
  margin-top: 0.5rem;
  width: 100%;
`;

export default ({ emailBody }) => (
  <EmailBodyContainer>
    <>
      <img src={EnvelopeIcon} alt="Email" />
      <pre style={{ height: '240px', fontSize: '14px' }}>{emailBody}</pre>
    </>
  </EmailBodyContainer>
);
