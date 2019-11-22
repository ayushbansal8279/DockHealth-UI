import React from 'react';
import styled from 'styled-components';
import EnvelopeIcon from '../../img/envelope.svg';

const EmailBodyContainer = styled.div`
  background-color: #f3f5f6;
  margin-top: 0.5rem;
  padding: 1rem;
  width: 100%;
`;

const EmailMessageContainer = styled.pre`
  font-size: 0.875rem;
  margin-top: 0.25rem;
  height: 15rem;
`;

export default ({ emailBody }) => (
  <EmailBodyContainer>
    <img src={EnvelopeIcon} alt="Email" />
    <EmailMessageContainer>{emailBody}</EmailMessageContainer>
  </EmailBodyContainer>
);
