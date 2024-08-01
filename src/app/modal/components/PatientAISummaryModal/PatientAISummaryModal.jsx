import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import Spacing from 'components/common/Spacing';
import {
  PatientAISummaryModalWrapper,
  Header,
  PatientName,
  SubHeader,
  IconWrapper,
  GeneratedTime,
  PatientInfo,
  RegenerateWrapper,
  ResponseButton,
  RefreshWrapper,
} from './styled';
import LuminaStar from 'img/AI/LuminaStar';
import palette from '@/app/styles/palette';
import Copy from 'img/AI/Copy.svg';
import Close from 'img/AI/XClose.svg';

const PatientAISummaryModal = ({ closeModal, patient }) => {
  useEffect(() => {
    if (!patient) {
      closeModal();
    }
  }, [closeModal, patient]);

  const [value, setValue] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText('Aditya Chaurasia');
  };

  const handlePromptChange = (event) => {
    setValue(event?.target.value);
  };

  const handleRegenrate = () => {
    console.log(value);
  };

  return (
    <PatientAISummaryModalWrapper>
      <Header>
        <SubHeader>
          <LuminaStar color={palette.newBrightBlue} />
          <PatientName>
            {patient?.lastName}, {patient?.firstName}
          </PatientName>
        </SubHeader>
        <div>
          <IconWrapper onClick={handleCopy} src={Copy} alt="copy" />
          <IconWrapper onClick={closeModal} src={Close} alt="close" />
        </div>
      </Header>
      <Spacing vertical={3} />
      <Grid container direction="column" item wrap="nowrap">
        <RegenerateWrapper>
          <GeneratedTime>Generated 2 m ago</GeneratedTime>
          <div>
            <TextField
              value={value}
              placeholder="Custom Prompt"
              size="small"
              sx={{
                backgroundColor: palette.white,
                '& .MuiOutlinedInput-root': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: palette.gunmetal,
                  },
                },
                width: '300px',
              }}
              onChange={handlePromptChange}
              variant="outlined"
            />
          </div>
          <RefreshWrapper style={{ background: palette.whiteSmoke }}>
            <LuminaStar color={palette.newBrightBlue} />
            <ResponseButton onClick={handleRegenrate}>Refresh</ResponseButton>
          </RefreshWrapper>
        </RegenerateWrapper>
        <Spacing vertical={4} />
        <PatientInfo>
          Patient info: <br />
          34 year old male patient named Bojan Ilioski El with date of birth
          1989-11-08, patient identifier 6ea1e12d-1a54-40db-ae63-7cd70b6fe4f3,
          created by Stefan Kochev on 2024-01-15, last updated on 2024-02-02,
          currently has active status. <br />
          <Spacing vertical={4} />
          Notes summary: <br />
          Notes indicate the patient's appetite is improving after follow-up. A
          Flomax prescription was sent to the pharmacy for the patient. The
          patient also reported no longer having nausea in a previous note.
          <Spacing vertical={4} />
          Workflows summary: <br />
          The first workflow involved calling the patient Bojan Ilioski to share
          lab results. It was conducted by Stefan Kochev on January 16, 2024.
          The lab results were received and analyzed, then the patient was
          called to discuss the findings. The call was documented in the
          patient's chart and follow up reminders were created. <br />
          <br />
          The second workflow was for onboarding patient Bojan Ilioski El. It
          involved contacting the patient, checking their medication and
          insurance information, submitting refill requests, and recording
          encounters. It was executed by Stefan Kochev from January 21-22, 2024.
          Initial contact was unsuccessful so alternative methods were used. A
          medication coverage issue was identified and resolved. All encounters
          were recorded in the EMR.
        </PatientInfo>
      </Grid>
    </PatientAISummaryModalWrapper>
  );
};

export default PatientAISummaryModal;
