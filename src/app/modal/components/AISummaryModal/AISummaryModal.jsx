import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import { useDispatch, useSelector } from 'react-redux';
import { DescriptionOutlined } from '@mui/icons-material';
import Copy from 'img/AI/Copy.svg';
import Close from 'img/AI/XClose.svg';
import RefreshIcon from 'img/AI/RefreshIcon.svg';
import EmailIcon from 'img/email-new-icon.svg';
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
  FeedbackLink,
  LabelContainer,
  LabelWrapper,
  RefreshIconWrapper,
} from './styled';
import MARIColor from 'img/AI/mari-color.png';
import New from '@/app/img/AI/New.svg';
import Expand from '@/app/img/AI/Expand.svg';
import palette from '@/app/styles/palette';
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
  userProfileSelector,
} from '@/app/selectors/user-selectors';
import { openModal } from '../../actions';
import MarkdownRenderer from '@/app/components/ai-summary/MarkdownRenderer';

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
  const [expanded, setExpanded] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [generateDateTime, setGeneratedDateTime] = useState('');
  const [stirngSummary, setStringSummary] = useState('');
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [tooltipHover, setTooltipHover] = useState({
    email: false,
    note: false,
    copy: false,
    regenrate: false,
  });
  const dispatch = useDispatch();

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  // const aiSummaryMultiplePrompts =
  //   currentOrganization?.themeSettings?.find(
  //     ({ name }) => name === 'ai.summary.multiple.prompts',
  //   ) || {};

  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);
  const currentUser = useSelector(userProfileSelector);

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

    let res = result?.remainingString.replace(/""/g, '**');
    res = res.replace(/(\[Your Name\])(?=[^\n]*$)/, currentUser?.name || "[Your Name]");
    
    if(persona === 'EMAIL'){
      const generatedSummaryLines = res.split("\n");
      if (/^Subject:\s*/i.test(generatedSummaryLines[0])) {
        const generatedSummarySubject = generatedSummaryLines[0].replace(/^Subject:\s*/i, "").trim();
        const updatedSummary = generatedSummaryLines.slice(1).join("\n").trim();
        setStringSummary(updatedSummary);
        setGeneratedSubject(generatedSummarySubject);
      }
    }
    else {
      setStringSummary(res);
    }

    const splitArray = res.split('\n\n');
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
    <AISummaryModalWrapper expanded={expanded}>
      <LabelContainer>
        <LabelWrapper>BETA</LabelWrapper>
      </LabelContainer>
      <Header>
        <Title>
          <img src={MARIColor} alt="AI Summary" style={{ height: 25 }} />
          {title}
        </Title>
        <div>
          <img
            style={{ cursor: 'pointer' }}
            onClick={() => setExpanded(!expanded)}
            src={Expand}
            alt="expand"
          />
          <IconWrapper onClick={closeModal} src={Close} alt="close" />
        </div>
      </Header>
      <SubHeader>
        <Box display="flex" gap={3}>
          <RefreshWrapper>
            {tooltipHover.regenrate && (
              <CustumTooltip left={5}>Regenerate</CustumTooltip>
            )}
            <RefreshIconWrapper
              onMouseEnter={() => setTooltipHover({ regenrate: true })}
              onMouseLeave={() => setTooltipHover({ regenrate: false })}
              onClick={handleReGenerateResponse}
              src={RefreshIcon}
              alt="Refresh"
            />
          </RefreshWrapper>
          {/* {aiSummaryMultiplePrompts?.value && ( */}
          <PromptSelector
            onChange={handlePromptTypeChange}
            defaultValue={promptTypeValue}
            value={promptTypeValue}
          >
            {promptoptions.map((option) => (
              <option value={option.value}>{option.key}</option>
            ))}
          </PromptSelector>
          {/* )} */}
        </Box>
        <Box display="flex" gap={2}>
          {postToEMRAvailable && (
            <>
              {tooltipHover.note && (
                <CustumTooltip right={70}>Post Note to EHR</CustumTooltip>
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
                      generatedSubject: generatedSubject
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
                      generatedSubject: generatedSubject
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
            summaries?.map((summary) => <MarkdownRenderer content={summary} />)}
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
        <Footer />
      ) : (
        <Footer>
          This AI-generated summary is provided for convenience and should be
          reviewed for accuracy and completeness.
          <FeedbackLink
            target="#"
            href="https://forms.dock.health/AISummaryFeedback"
          >
            Please share your feedback to help us improve.
          </FeedbackLink>
        </Footer>
      )}
    </AISummaryModalWrapper>
  );
};

export default AISummaryModal;
