import { Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import LightbulbBlue from '../../img/lightbulb-blue.svg';
import Lightbulb from '../../img/lightbulb-grey.svg';
import palette from '../../palette';
import { RobotoTypography } from '../../theme';
import Spacing from './Spacing';

const TipsButtonContainer = styled.div`
  color: ${props => (props.active ? palette.brightBlue : palette.coolGrey1)};
`;

const TipsButton = ({ active, toggleTips, tipsButtonReference }) => (
  <TipsButtonContainer active={active}>
    <Button
      variant="text"
      color="inherit"
      size="small"
      onClick={toggleTips}
      innerRef={tipsButtonReference}
    >
      <img alt="lightbulb" src={active ? LightbulbBlue : Lightbulb} />
      <Spacing horizontal={2} />
      <RobotoTypography color="inherit" weight="normal">
        TIPS
      </RobotoTypography>
    </Button>
  </TipsButtonContainer>
);

export default TipsButton;
