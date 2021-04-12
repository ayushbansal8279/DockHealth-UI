import React from 'react';
import { bool, func } from 'prop-types';
import { Close } from '@material-ui/icons';
import Button from 'components/common/Button/Button';
import TemplatesIcon from 'img/navigation/TemplatesIcon';
import {
  TemplateBanerContainer,
  BanerCircleBackground,
  CloseButton,
  TextContainer,
  Title,
  Description,
} from './styled';

const TaskTemplateBaner = ({ onClose, onCreateTemplate, firstTemplate }) => {
  return (
    <TemplateBanerContainer>
      <BanerCircleBackground>
        <TemplatesIcon size={32} />
      </BanerCircleBackground>
      <TextContainer>
        {firstTemplate && <Title>Create your first template</Title>}
        <Description>
          Templates will help you save even more time by eliminating repetitive
          work. Create a template for the workflows that you find your
          organizations doing over and over again so you don’t have to type each
          task everytime.
        </Description>
      </TextContainer>
      {firstTemplate && (
        <Button uppercase={false} onClick={onCreateTemplate}>
          Create your first template
        </Button>
      )}
      <CloseButton type="button" onClick={onClose}>
        <Close color="inherit" />
      </CloseButton>
    </TemplateBanerContainer>
  );
};

TaskTemplateBaner.propTypes = {
  onClose: func.isRequired,
  onCreateTemplate: func.isRequired,
  firstTemplate: bool,
};

TaskTemplateBaner.defaultProps = {
  firstTemplate: false,
};

export default TaskTemplateBaner;
