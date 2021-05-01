import React from 'react';
import { bool, func } from 'prop-types';
import { Close } from '@material-ui/icons';
import Button from 'components/common/Button/Button';
import TemplatesIcon from 'img/navigation/TemplatesIcon';
import {
  TemplateBannerContainer,
  BannerCircleBackground,
  CloseButton,
  TextContainer,
  Title,
  Description,
} from './styled';

const TaskTemplateBanner = ({ onClose, onCreateTemplate, firstTemplate }) => {
  return (
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
          Workflow to a list from the “Add Task” bar, add patient context and
          customize it as needed.
        </Description>
      </TextContainer>
      {firstTemplate && (
        <Button uppercase={false} onClick={onCreateTemplate}>
          Create your first workflow
        </Button>
      )}
      <CloseButton type="button" onClick={onClose}>
        <Close color="inherit" />
      </CloseButton>
    </TemplateBannerContainer>
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
