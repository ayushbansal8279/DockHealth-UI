import React from 'react';
import styled from 'styled-components';

import PatientsAdd from './PatientsAdd';

const PatientsHeaderContainer = styled.div`
  display: flex;
  background: #fff;
  height: 88px;
  padding: 14px 40px 0 22px;
`;

const PatientsHeaderLeftSide = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-bottom: 6px;
`;

const PatientsHeaderHeading = styled.span`
  font-size: 36px;
  line-height: 42px;
  color: #303538;
`;

const PatientsHeaderSubheading = styled.span`
  font-size: 16px;
  line-height: 26px;
  color: #2e3a43;
`;

const PatientsHeader = ({ patientCount = 0, isFetching }) => (
  <PatientsHeaderContainer>
    <PatientsHeaderLeftSide>
      <PatientsHeaderHeading>Patients</PatientsHeaderHeading>
      <PatientsHeaderSubheading>
        {isFetching ? '' : `${patientCount} patients`}
      </PatientsHeaderSubheading>
    </PatientsHeaderLeftSide>
    <PatientsAdd />
  </PatientsHeaderContainer>
);

export default PatientsHeader;
