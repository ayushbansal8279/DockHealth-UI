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
  CustomPromptInput,
  CopyTooltip,
} from './styled';
import LuminaStar from 'img/AI/LuminaStar';
import palette from '@/app/styles/palette';
import Copy from 'img/AI/Copy.svg';
import Close from 'img/AI/XClose.svg';
import { calculateResponseTimeAgo, separateTimestamp } from './helper';

const AISummaryModal = ({ closeModal, title, onsubmit, type }) => {
  useEffect(() => {
    if (!title) {
      closeModal();
    }
  }, [closeModal, title]);

  useEffect(() => {
    handleGenerateResponse(false);
  }, []);

  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [generateDateTime, setGeneratedDateTime] = useState('');

  const handleCopy = () => {
    const formattedString = summaries.join('\n\n');
    navigator.clipboard.writeText(formattedString);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handlePromptChange = (event) => {
    setValue(event?.target.value);
  };

  const handleGenerateResponse = async (forceRefresh) => {
    setIsFetching(true);
    const response = await onsubmit(value, forceRefresh);
    setIsFetching(false);

    const result = separateTimestamp(response);
    const responseDateTime = calculateResponseTimeAgo(result.timestamp);
    setGeneratedDateTime(responseDateTime);

    const splitArray = result.remainingString.split('\n');
    splitArray ? setSummaries(splitArray) : null;
  };

  const handleReGenerateResponse = async () => {
    handleGenerateResponse(true);
  };

  const AISummaryLoader = () => {
    return new Array(5).fill().map((_, index) => (
      <>
        <AISummaryLoaderSkeleton key={index} />
        <Spacing vertical={2} />
      </>
    ));
  };

  return (
    <AISummaryModalWrapper>
      <Header>
        <SubHeader>
          <LuminaStar color={palette.newBrightBlue} />
          <Title>{title}</Title>
        </SubHeader>
        <div style={{ display: 'flex' }}>
          <IconWrapper onClick={handleCopy} src={Copy} alt="copy" />
          <CopyTooltip copied={copied}>
            {copied ? 'Copied to clipboard!' : ''}
          </CopyTooltip>
          <IconWrapper onClick={closeModal} src={Close} alt="close" />
        </div>
      </Header>
      <Spacing vertical={3} />
      <Grid container direction="column" item wrap="nowrap">
        <RegenerateWrapper>
          {!isFetching && (
            <GeneratedTime>Generated {generateDateTime}</GeneratedTime>
          )}
          {/* <RefreshWrapper>
            <LuminaStar color={palette.newBrightBlue} />
            <ResponseButton onClick={handleReGenerateResponse}>
              Refresh
            </ResponseButton>
          </RefreshWrapper> */}
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
      <RegenerateWrapper>
        <CustomPromptInput
          maxRows={3}
          disabled={isFetching}
          value={value}
          placeholder="Custom Prompt"
          size="small"
          onChange={handlePromptChange}
          variant="outlined"
        />
        <RefreshWrapper>
          <LuminaStar color={palette.newBrightBlue} />
          <ResponseButton onClick={handleReGenerateResponse}>
            Refresh
          </ResponseButton>
        </RefreshWrapper>
      </RegenerateWrapper>
    </AISummaryModalWrapper>
  );
};

export default AISummaryModal;
