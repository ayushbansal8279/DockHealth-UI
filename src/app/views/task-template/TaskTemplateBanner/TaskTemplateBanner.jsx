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
