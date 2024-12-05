import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
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
  PromptSelector,
  CustumTooltip,
  Footer,
} from './styled';
import LuminaStar from 'img/AI/LuminaStar';
import palette from '@/app/styles/palette';
import Copy from 'img/AI/Copy.svg';
import Close from 'img/AI/XClose.svg';
import RefreshIcon from 'img/AI/RefreshIcon.svg';
import EmailIcon from 'img/email-new-icon.svg';
import {
  calculateResponseTimeAgo,
  patientPromptOptions,
  separateTimestamp,
  taskPromptOptions,
} from './helper';
import { SummaryType } from '@/app/helpers/ai-helper';
import {
  selectedUserOrganizationSelector,
  userHasPostEMRNoteFeatureSelector,
  userHasSendEmailFeatureSelector,
} from '@/app/selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../actions';
import { DescriptionOutlined } from '@mui/icons-material';

const AISummaryModal = ({ closeModal, title, onsubmit, type, identifier }) => {
  useEffect(() => {
    if (!title) {
      closeModal();
    }
  }, [closeModal, title]);

  const promptoptions =
    type === SummaryType.PATIENT ? patientPromptOptions : taskPromptOptions;

  useEffect(() => {
    handleGenerateResponse(false);
  }, []);

  // const [customPrompt, setCustomPrompt] = useState('');
  const [promptTypeValue, setPromptTypeValue] = useState('DEFAULT');
  const [copied, setCopied] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [generateDateTime, setGeneratedDateTime] = useState('');
  const [stirngSummary, setStringSummary] = useState('');
  const [tooltipHover, setTooltipHover] = useState({
    email: false,
    note: false,
    copy: false,
    regenrate: false,
  });
  const dispatch = useDispatch();

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const aiSummaryMultiplePrompts =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'ai.summary.multiple.prompts',
    ) || {};

  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);

  const handleCopy = () => {
    const formattedString = summaries.join('\n\n');
    navigator.clipboard.writeText(formattedString);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handlePromptTypeChange = (event) => {
    const promptType = event?.target?.value;
    setPromptTypeValue(promptType);
    handleGenerateResponse(false, promptType);
  };

  // const handleCustomPrompt = (event) => {
  //   const customPrompt = event?.target?.value;
  //   setCustomPrompt(customPrompt);
  //   handleGenerateResponse(true, promptTypeValue, customPrompt);
  // };

  const handleGenerateResponse = async (force, persona, customPrompt) => {
    setIsFetching(true);
    const response = await onsubmit(force, persona, customPrompt);
    setIsFetching(false);

    const result = separateTimestamp(response);
    const responseDateTime = calculateResponseTimeAgo(result.timestamp);
    setGeneratedDateTime(responseDateTime);
    setStringSummary(result?.remainingString);

    const splitArray = result?.remainingString.split('\n');
    splitArray ? setSummaries(splitArray) : null;
  };

  const handleReGenerateResponse = async () => {
    const persona = promptTypeValue === 'DEFAULT' ? '' : promptTypeValue;
    handleGenerateResponse(true, persona);
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
        <Title>
          <LuminaStar color={palette.newBrightBlue} />
          {title}
        </Title>
        <IconWrapper onClick={closeModal} src={Close} alt="close" />
      </Header>
      <SubHeader>
        <Box display="flex" gap={3}>
          <RefreshWrapper>
            {tooltipHover.regenrate && (
              <CustumTooltip left={5}>Regenerate</CustumTooltip>
            )}
            <IconWrapper
              onMouseEnter={() => setTooltipHover({ regenrate: true })}
              onMouseLeave={() => setTooltipHover({ regenrate: false })}
              onClick={handleReGenerateResponse}
              src={RefreshIcon}
              alt="Refresh"
            />
          </RefreshWrapper>
          {aiSummaryMultiplePrompts?.value && (
            <PromptSelector
              onChange={handlePromptTypeChange}
              defaultValue={promptTypeValue}
              value={promptTypeValue}
            >
              {promptoptions.map((option) => (
                <option value={option.value}>{option.key}</option>
              ))}
            </PromptSelector>
          )}
        </Box>
        <Box display="flex" gap={2}>
          {postToEMRAvailable && (
            <>
              {tooltipHover.note && (
                <CustumTooltip right={70}>Post EMR note</CustumTooltip>
              )}
              <DescriptionOutlined
                onMouseEnter={() => setTooltipHover({ note: true })}
                onMouseLeave={() => setTooltipHover({ note: false })}
                onClick={() => {
                  dispatch(
                    openModal('SendEmrFromTask', {
                      source: 'Ai Summary Modal',
                      identifier,
                      generatedSummary: stirngSummary,
                    }),
                  );
                }}
                style={{ color: palette.coolGrey1, cursor: 'pointer' }}
              />
            </>
          )}
          {sendEmailAvailable && (
            <>
              {tooltipHover.email && (
                <CustumTooltip right={20}>Email Summary</CustumTooltip>
              )}
              <IconWrapper
                onMouseEnter={() => setTooltipHover({ email: true })}
                onMouseLeave={() => setTooltipHover({ email: false })}
                onClick={() => {
                  dispatch(
                    openModal('SendEmailFromTask', {
                      source: 'Ai Summary Modal',
                      taskIdentifier: identifier,
                      generatedSummary: stirngSummary,
                    }),
                  );
                }}
                src={EmailIcon}
                alt="email"
              />
            </>
          )}
          {tooltipHover.copy && <CustumTooltip right={15}>Copy</CustumTooltip>}
          <IconWrapper
            onMouseEnter={() => setTooltipHover({ copy: true })}
            onMouseLeave={() => setTooltipHover({ copy: false })}
            onClick={handleCopy}
            src={Copy}
            alt="copy"
          />
          <CopyTooltip copied={copied}>
            {copied ? 'Copied to clipboard!' : ''}
          </CopyTooltip>
        </Box>
      </SubHeader>
      <Spacing vertical={3} />
      <Grid container direction="column" item wrap="nowrap">
        <RegenerateWrapper>
          {isFetching ? (
            <GeneratedTime>Generating Summary...</GeneratedTime>
          ) : (
            <GeneratedTime>Generated {generateDateTime}</GeneratedTime>
          )}
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
      {/* <RegenerateWrapper>
        <CustomPromptInput
          maxRows={3}
          disabled={isFetching}
          value={customPrompt}
          placeholder="Custom Prompt"
          size="small"
          onChange={handleCustomPrompt}
          variant="outlined"
        />
        <RefreshWrapper>
          <LuminaStar color={palette.newBrightBlue} />
          <ResponseButton onClick={handleReGenerateResponse}>
            Refresh
          </ResponseButton>
        </RefreshWrapper>
      </RegenerateWrapper> */}
      {isFetching ? (
        <Footer></Footer>
      ) : (
        <Footer>
          This AI-generated summary is provided for convenience and should be
          reviewed for accuracy and completeness. Is it helpful? If not, Please
          share your feedback to help us improve.
        </Footer>
      )}
    </AISummaryModalWrapper>
  );
};

export default AISummaryModal;
