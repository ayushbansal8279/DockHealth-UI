import React from 'react';
import { bool, func } from 'prop-types';
import { Close } from '@material-ui/icons';
import Button from 'components/common/Button/Button';
import TemplatesIcon from 'img/navigation/TemplatesIcon';
import SmartFlowIcon from 'img/template/smartflow.svg';
import Spacing from 'components/common/Spacing';
import {
  TemplateBannerContainer,
  BannerCircleBackground,
  CloseButton,
  TextContainer,
  Title,
  Description,
  SmartFlowIndicatorIcon,
} from './styled';

const TaskTemplateBanner = ({ onClose, onCreateTemplate, firstTemplate }) => {
  return (
    <>
      <TemplateBannerContainer>
        <BannerCircleBackground>
          <TemplatesIcon size={32} />
        </BannerCircleBackground>
        <TextContainer>
          {firstTemplate && <Title>Create your first workflow</Title>}
          {!firstTemplate && <Title>Create workflows</Title>}
          <Description>
            Workflows will help you save time and create a highly reliable and
            accountable process for your organization. Simply design a reusable
            Workflow by giving it a name and adding tasks, subtasks, assignments
            and attachments to your template. Once saved, you can easily add any
            Workflow to a list from the “Add Task” bar, add patient/client
            context and customize it as needed.
          </Description>
          <Spacing vertical={1} />
          {/* {firstTemplate && ( */}
          <Button uppercase={false} onClick={onCreateTemplate} width="250px">
            Create your first workflow
          </Button>
          {/* )} */}
        </TextContainer>
        <CloseButton type="button" onClick={onClose}>
          <Close color="inherit" />
        </CloseButton>
      </TemplateBannerContainer>
      <Spacing vertical={4} />
      <TemplateBannerContainer>
        <SmartFlowIndicatorIcon src={SmartFlowIcon} alt="SmartFlow" />
        <TextContainer>
          <Title>Introducing SmartFlows</Title>
          <Description>
            We know that healthcare delivery isn’t always linear. For our newest
            innovation, we have taken workflows to the next level. As part of
            our Premium package, you can now add branching logic, dependencies
            and time delays to your workflows. We call them SmartFlows. You will
            find a couple of them in the “Standard Workflows” folder. Try them
            out. Deploy one in a list and watch the magic.
          </Description>
        </TextContainer>
      </TemplateBannerContainer>
    </>
  );
};

TaskTemplateBanner.propTypes = {
  onClose: func.isRequired,
  onCreateTemplate: func.isRequired,
  firstTemplate: bool,
};

TaskTemplateBanner.defaultProps = {
  firstTemplate: false,
};

export default TaskTemplateBanner;
