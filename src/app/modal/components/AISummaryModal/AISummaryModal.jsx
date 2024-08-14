import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import Spacing from 'components/common/Spacing';
import {
  AISummaryModalWrapper,
  Header,
  Title,
  SubHeader,
  IconWrapper,
  GeneratedTime,
  Info,
  RegenerateWrapper,
  ResponseButton,
  RefreshWrapper,
  AISummaryLoaderSkeleton,
} from './styled';
import LuminaStar from 'img/AI/LuminaStar';
import palette from '@/app/styles/palette';
import Copy from 'img/AI/Copy.svg';
import Close from 'img/AI/XClose.svg';

const AISummaryModal = ({ closeModal, title, onsubmit, type }) => {
  useEffect(() => {
    if (!title) {
      closeModal();
    }
  }, [closeModal, title]);

  const [value, setValue] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleCopy = () => {
    const formattedString = summaries.join('\n\n');
    navigator.clipboard.writeText(formattedString);
  };

  const handlePromptChange = (event) => {
    setValue(event?.target.value);
  };

  const handleGenerateResponse = async () => {
    setIsFetching(true);
    const response = await onsubmit();
    setIsFetching(false);

    const splitArray = response.split(type === 'Patient' ? '-' : /(?<!Dr)\./);

    const formattedArray = splitArray
      .filter((item) => item.trim() !== '')
      .map((item) => item.trim().replace(':', ':\n'));

    formattedArray ? setSummaries(formattedArray) : null;
  };

  const AISummaryLoader = () => {
    return new Array(5).fill().map((_, index) => (
      <>
        <AISummaryLoaderSkeleton key={index} />
        <Spacing vertical={2} />
      </>
    ));
  };

  const textFieldSX = {
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
  };

  return (
    <AISummaryModalWrapper>
      <Header>
        <SubHeader>
          <LuminaStar color={palette.newBrightBlue} />
          <Title>{title}</Title>
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
              sx={textFieldSX}
              onChange={handlePromptChange}
              variant="outlined"
            />
          </div>
          <RefreshWrapper>
            <LuminaStar color={palette.newBrightBlue} />
            <ResponseButton onClick={handleGenerateResponse}>
              Refresh
            </ResponseButton>
          </RefreshWrapper>
        </RegenerateWrapper>
        <Spacing vertical={4} />
        {isFetching && AISummaryLoader()}
        <Info>
          {!isFetching &&
            summaries?.map((summary) => (
              <>
                {summary}
                <Spacing vertical={4} />
              </>
            ))}
        </Info>
      </Grid>
    </AISummaryModalWrapper>
  );
};

export default AISummaryModal;
