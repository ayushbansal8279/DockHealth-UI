import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button/Button';
import LightbulbBlue from 'img/lightbulb-blue.svg';
import Lightbulb from 'img/lightbulb-grey.svg';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';

const TipsButtonContainer = styled.div`
  color: ${props => (props.active ? palette.brightBlue : palette.coolGrey1)};
`;

const TipsButton = React.forwardRef(({ active, toggleTips }, reference) => (
  <TipsButtonContainer active={active}>
    <Button
      variant="text"
      onClick={toggleTips}
      innerRef={reference}
      startIcon={
        <img alt="lightbulb" src={active ? LightbulbBlue : Lightbulb} />
      }
    >
      <RobotoTypography color="inherit" weight="normal">
        TIPS
      </RobotoTypography>
    </Button>
  </TipsButtonContainer>
));

export default TipsButton;
